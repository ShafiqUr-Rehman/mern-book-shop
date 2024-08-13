import express from "express"
const router=express.Router();
import { bookModel } from "../model/bookModel.js";

router.post("/add",async(req,res)=>{
  const{bookname,authname,url}=req.body;
  try{
    const alreadybook=await bookModel.findOne({bookname})
    if(alreadybook)
    {
      return res.json({success:false});
    }
    const book=await bookModel.create({
      bookname,
      authname,
      url

    })
       res.send({success:true});

  }
  catch(err)
  {
    res.json({errore:err})
  }

})

router.get("/read", async(req, res) => {

  try {
  
    const books = await bookModel.find();
    res.json({ book: books });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.get("/readone/:id", async(req, res) => {

  try {
    const id=req.params.id;
  
    const book = await bookModel.findOne({_id:id});
    res.json({ book: book });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/edit/:id", async(req, res) => {

  try {

    const id=req.params.id;
    const{bookname,authname,url}=req.body
    const alreadybook=await bookModel.findOne({bookname:bookname});
    if(alreadybook)
    {
      return res.json({success:false});
    }
  
    const book = await bookModel.findOneAndUpdate({_id:id},{
      bookname,
      authname,
      url,
    });
    res.json({success:true, book: book });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/delete/:id", async(req, res) => {

  try {

    const id=req.params.id;
 

 
  
    const book = await bookModel.findOneAndDelete({_id:id});
    res.json({success:true });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/count",async(req,res)=>{
  const books=await bookModel.find();
  res.json({count:books.length})
})
export { router as bookRouter };