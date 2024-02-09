import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from "mongodb";
import formidable from 'formidable';
import multer from 'multer';
const storage = multer.diskStorage({
  destination: (req:any, file:any, callback:any) => {
      callback(null, 'FileStorage/');
  },
  filename: (req:any, file:any, callback:any) => {
      callback(null, Date.now() + file.originalname);
  }
})
const FileUpload = multer({
  storage: storage,
  
  limits: {
      fileSize: 1024 * 1024 * 5
  }
}).single('proofOfCompletion');
export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    const { projectName, stageNumber, amountRequested, proofOfCompletion,verified } = await req.json(); 
    FileUpload(req as any, NextResponse as any, async (error: any) => {
      if (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error handling file upload' }, { status: 500 });
      }})
    
    
    const mongoURI = process.env.MONGODB_URI ?? '';
    const client = new MongoClient(mongoURI, {});

    try {
      await client.connect();
      const database = client.db('MajorProjectDatabase');
      const collection = database.collection('BuilderData');

      await collection.insertOne({ projectName, stageNumber, amountRequested, proofOfCompletion ,verified});

      const result = {
        message: "Data saved successfully",
      };
      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Something went wrong!' });
    } finally {
      await client.close();
    }
  } else {
    return NextResponse.json({ message: 'Method not allowed!' });
  }
}

export async function GET(req: NextRequest) {
  if (req.method === 'GET') {
    const mongoURI = process.env.MONGODB_URI ?? '';
    const client = new MongoClient(mongoURI, {});

    try {
      await client.connect();
      const database = client.db('MajorProjectDatabase');
      const collection = database.collection('BuilderData');

      const data = await collection.find().toArray();
      return NextResponse.json(data);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Something went wrong!' });
    } finally {
      await client.close();
    }
  } else {
    return NextResponse.json({ message: 'Method not allowed!' });
  }
}
