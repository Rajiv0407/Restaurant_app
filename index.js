import express, { json, urlencoded } from "express";
import ConnectDb from './dbconfig.js';
import { ObjectId } from "mongodb";
import cors from "cors";
const app = express();

app.use(cors());  

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
        const result = collection.deleteOne({'_id': new ObjectId(id)});
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

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const db = await ConnectDb();
        const collection = await db.collection('add_item');
        const result = await collection.find().skip(skip).limit(limit).toArray();
        const totalProducts = await collection.countDocuments();
        //console.log(totalProducts);  
        if (result) {
            res.status(200).json({
                status:true,
                message: 'Item Listing',
                result: result,
                totalCount:totalProducts
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


//////////////////****Customer Api *****///////////////////////////

app.post('/add_customer',async(req,res)=>{   
    const data=req.body;
    try {
        req.body.status = 1;
        const itemData = req.body;
        const db = await ConnectDb();
        const collection = db.collection('customers');
        const result = await collection.insertOne(itemData);
        //console.log(result);
        if (result) {
            res.send({
                status: 201,
                message: 'Customer added Successfully!',
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

app.get('/user_list',async(req,res)=>{
    const db =await ConnectDb();
    const collection = await db.collection('customers');
    const result= await collection.find().toArray();
    //console.log(result);
    if(result){
        res.send({
            status:200,
            message:'User Listing !',
            result:result
        })
    }else{
       res.send({
            status:200,
            message:'User Listing !',
            result:[]
        })
    }
      
})

app.delete('/user_delete/:id',async(req,res)=>{
    const id =req.params.id;      
    const db= await ConnectDb();
    const collection =await db.collection('customers');
    const result =collection.deleteOne({_id:new ObjectId(id)});
    if(result){              
        res.status(200).json({
            status:true,
            message:'User Deleted Successfully!'
        })
    }else{
         res.status(400).json({
            status:false,
            message:'User not Deleted !'
        })
    }

})

app.get('/user_details/:id',async(req,res)=>{
    try{
    const id=req.params.id;
    const db = await ConnectDb();
    const collection = await db.collection('customers');
    let data = await collection.findOne({_id: new ObjectId(id)});
    if(data){
        res.status(200).json({
            message:"User Details info!",
            result:data
        })
    }else{
        res.status(400).json({
            message:"User Details not found!"
        })
    }
}catch(err){
    res.status(500).json({
            message: err.message
        });
}

})

app.put('/update_customer/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const itemData = req.body;
        delete itemData._id;  
        const db = await ConnectDb();
        const collection = await db.collection('customers');
        const result = collection.updateOne({ '_id': new ObjectId(id) }, { $set: itemData });
        if (result) {
            res.status(200).json({
                status: true,
                message: 'Customer Updated Successfully!',
                result: {
                    _id: result.insertedId,
                    ...req.body
                }
            })
        } else {
            res.status(400).json({
                status: fasle,
                message: 'Customer not Updated',
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})
app.listen(3200);   