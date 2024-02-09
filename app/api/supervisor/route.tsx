import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { ObjectId} from 'mongodb';


export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const {id}  = await req.json();

      console.log('Received ID:',  id);

      const mongoURI = process.env.MONGODB_URI ?? '';
      const client = new MongoClient(mongoURI, {});

      await client.connect();
      const database = client.db('MajorProjectDatabase');
      const collection = database.collection('BuilderData');


      // const ObjectId = require('mongodb').ObjectID;
      const result = await collection.findOne({ _id: new ObjectId(id) });
    
        if (result) {
        console.log('Object ID exists in the collection');
        const updateResult = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { verified: true } }
        );
        if (updateResult) {
          console.log('Document updated successfully');
        } else {
          console.log('Document not updated');
        }
      } else {
        console.log('Object ID does not exist in the collection');
      }

      await client.close();

      return NextResponse.json({ message: 'Data verified successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error verifying data:', error);
      return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Method not allowed!' }, { status: 405 });
  }
}
