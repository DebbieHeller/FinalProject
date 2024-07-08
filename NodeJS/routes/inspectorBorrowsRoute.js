const express = require('express');
const inspectorBorrowsRouter = express.Router();
inspectorBorrowsRouter.use(express.json());
const { getInspectorBorrows, updateBorrowByInspector,getLateBorrows } = require('../controllers/borrowsController');

inspectorBorrowsRouter.get('/', async (req, res) => {
    const libraryId = req.query.libraryId;
    const date = req.query.date;
    if(!date){
        try {
            const books = await getInspectorBorrows(libraryId);
            res.status(200).send(books);
        } catch (error) {
            res.status(500).send({ error: 'Failed to fetch books' });
        }
    }
    else if(date){
        try {
            const books = await getLateBorrows(req.query.libraryId,req.query.date);
            res.status(200).send(books);
        } catch (error) {
            res.status(500).send({ error: 'Failed to fetch books' });
        }
    }
        
   
});




inspectorBorrowsRouter.put('/:borrowId', async (req, res) => {
    console.log(req.body)
    try {
       
        await updateBorrowByInspector(
            req.params.borrowId,
            req.body.copyBookId,
            req.body.isReturned,
            req.body.isIntact
        );
        res.status(200).send;
    } catch (error) {
        res.status(500).send({ error: 'Failed to update borrow' });
    }
});


module.exports = inspectorBorrowsRouter;