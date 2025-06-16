const router = require('express').Router();

const { 
	addBookmark, getBookmarks, deleteBookmark 
} = require('../controllers/bookmarkController');

const protect = require('../middleware/Auth.js'); 


router.post('/', protect, addBookmark);
router.get('/', protect, getBookmarks);
router.delete('/:bookmarkId', protect, deleteBookmark);


module.exports = router;