import { FastifyInstance } from 'fastify';
import Screenshot from '../models/screenshot';
import PDFDocument from 'pdfkit';

const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']);

export default async function screenshotsRoutes(app: FastifyInstance) {
  app.get('/screenshots', async (_request, reply) => {
    const screenshots = await Screenshot.find()
      .sort({ createdAt: 1 })
      .select('-image')
      .lean();

    return reply.send(screenshots);
  });

  app.get('/screenshots/:id/image', async (request, reply) => {
    const { id } = request.params as { id: string };
    const screenshot = await Screenshot.findById(id);

    if (!screenshot) {
      return reply.code(404).send({ message: 'Screenshot not found' });
    }

    reply.header('Content-Type', screenshot.mimeType);
    reply.header('Content-Disposition', `inline; filename="${screenshot.fileName}"`);
    return reply.send(screenshot.image);
  });

  app.post('/screenshots', async (request, reply) => {
    const parts = request.parts();

    let title = '';
    let description = '';
    let fileBuffer: Buffer | null = null;
    let mimeType = '';
    let fileName = '';

    for await (const part of parts) {
      if (part.type === 'file') {
        mimeType = part.mimetype;
        fileName = part.filename || `screenshot-${Date.now()}`;
        fileBuffer = await part.toBuffer();
      } else if (part.fieldname === 'title') {
        title = (part.value || '').trim();
      } else if (part.fieldname === 'description') {
        description = (part.value || '').trim();
      }
    }

    if (!title || !fileBuffer) {
      return reply.code(400).send({ message: 'title and screenshot file are required' });
    }

    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return reply.code(400).send({ message: 'Invalid image type. Use png, jpeg, or webp' });
    }

    const screenshot = await Screenshot.create({
      title,
      description,
      image: fileBuffer,
      mimeType,
      fileName
    });

    return reply.code(201).send({
      _id: screenshot._id,
      title: screenshot.title,
      description: screenshot.description,
      mimeType: screenshot.mimeType,
      fileName: screenshot.fileName,
      createdAt: screenshot.createdAt,
      updatedAt: screenshot.updatedAt
    });
  });

  app.put('/screenshots/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const screenshot = await Screenshot.findById(id);

    if (!screenshot) {
      return reply.code(404).send({ message: 'Screenshot not found' });
    }

    const parts = request.parts();

    let title: string | undefined;
    let description: string | undefined;
    let fileBuffer: Buffer | undefined;
    let mimeType: string | undefined;
    let fileName: string | undefined;

    for await (const part of parts) {
      if (part.type === 'file') {
        mimeType = part.mimetype;
        fileName = part.filename || `screenshot-${Date.now()}`;
        fileBuffer = await part.toBuffer();
      } else if (part.fieldname === 'title') {
        title = (part.value || '').trim();
      } else if (part.fieldname === 'description') {
        description = (part.value || '').trim();
      }
    }

    if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType)) {
      return reply.code(400).send({ message: 'Invalid image type. Use png, jpeg, or webp' });
    }

    if (typeof title !== 'undefined' && title.length > 0) {
      screenshot.title = title;
    }

    if (typeof description !== 'undefined') {
      screenshot.description = description;
    }

    if (fileBuffer && mimeType) {
      screenshot.image = fileBuffer;
      screenshot.mimeType = mimeType;
      screenshot.fileName = fileName || screenshot.fileName;
    }

    await screenshot.save();

    return reply.send({
      _id: screenshot._id,
      title: screenshot.title,
      description: screenshot.description,
      mimeType: screenshot.mimeType,
      fileName: screenshot.fileName,
      createdAt: screenshot.createdAt,
      updatedAt: screenshot.updatedAt
    });
  });

  app.delete('/screenshots/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const deleted = await Screenshot.findByIdAndDelete(id);

    if (!deleted) {
      return reply.code(404).send({ message: 'Screenshot not found' });
    }

    return reply.code(204).send();
  });

  app.get('/screenshots/export/pdf', async (_request, reply) => {
    const screenshots = await Screenshot.find().sort({ createdAt: 1 }).lean();

    const pdf = new PDFDocument({ autoFirstPage: true, margin: 40 });
    const chunks: Buffer[] = [];

    pdf.on('data', (chunk) => chunks.push(chunk));

    for (let i = 0; i < screenshots.length; i += 1) {
      const shot = screenshots[i];
      if (i > 0) {
        pdf.addPage();
      }

      pdf.fontSize(18).text(shot.title || `Screenshot ${i + 1}`, { underline: true });
      pdf.moveDown(0.5);
      pdf.fontSize(12).text(shot.description || 'No description provided.');
      pdf.moveDown(1);

      try {
        pdf.image(shot.image, {
          fit: [500, 620],
          align: 'center',
          valign: 'center'
        });
      } catch {
        pdf.fillColor('red').text('Unable to render image in PDF');
        pdf.fillColor('black');
      }
    }

    pdf.end();

    const output = await new Promise<Buffer>((resolve) => {
      pdf.on('end', () => resolve(Buffer.concat(chunks)));
    });

    reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', 'attachment; filename="screenshots-export.pdf"');

    return reply.send(output);
  });
}
