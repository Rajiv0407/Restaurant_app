import express, { json, urlencoded } from "express";
import ConnectDb from './dbconfig.js';
import { ObjectId } from "mongodb";
const app = express();

app.use(express.urlencoded({ extended: true })); // this middleware useing for getting data from request body 
app.use(express.json());

app.get("/", (req, res) => {
    res.send({
        status: true,
        message: 'Api connected'
    })
})
app.post('/add_item', async (req, res) => {
    try {
        const itemData = req.body;
        const db = await ConnectDb();
        const collection = db.collection('add_item');
        const result = await collection.insertOne(itemData);
        if (result) {
            res.send({
                status: 201,
                message: 'Data added Successfully!',
                data: {
                    _id: result.insertedId,
                    ...req.body
                }
            })
        } else {
            res.send({
                status: 500,
                result: result,
                message: 'Data Not added'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
})

app.put('/update_item/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const itemData = req.body;
        const db = await ConnectDb();
        const collection = await db.collection('add_item');
        const result = collection.updateOne({ '_id': new ObjectId(id) }, { $set: itemData });
        if (result) {
            res.status(200).json({
                status: true,
                message: 'Item Updated Successfully!',
                result: {
                    _id: result.insertedId,
                    ...req.body
                }
            })
        } else {
            res.status(400).json({
                status: fasle,
                message: 'Item not Updated',
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

app.delete('/delete_item/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const db = await ConnectDb();
        const collection = await db.collection('add_item');
        const result = collection.deleteOne({ '_id': new ObjectId(id) });
        if (result) {
            res.status(200).json({
                status: true,
                message: 'Item Deleted Successfully!',
            })
        } else {
            res.status(400).json({
                status: fasle,
                message: 'Item not deleted',
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

app.get('/item_list', async (req, res) => {
    try {
        const db = await ConnectDb();
        const collection = await db.collection('add_item');
        const result = await collection.find().toArray();
        //console.log(result);
        if (result) {
            res.status(200).json({
                message: 'Item Listing',
                result: result
            })
        } else {
            res.status(200).json({
                mesage: 'Item Listing',
                result: []
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
})


app.delete('/multiple-item-delete', async (req, res) => {
    const db = await ConnectDb();
    const ids = req.body;
    const deleteTaskIds = ids && ids.map((item) => new ObjectId(item))
    console.log(deleteTaskIds) ;     
     const collection = await db.collection('add_item');
    let result = await collection.deleteMany({ _id: { $in: deleteTaskIds }})
    if (result) {
        res.send({ message: 'Task Deleted Successfully', success: result })
    } else {
        res.send({ message: 'List not found', success: false })
    }
})

app.listen(3200);