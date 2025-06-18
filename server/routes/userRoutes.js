const router = require('express').Router();

const {
  userRegistration, userLogin, getUserData, updateUser, deleteUser
} = require('../controllers/userController.js');

const protect = require('../middleware/Auth.js'); 

const { upload } = require('../middleware/multer.js');


router.post('/registration', upload.fields([{ name: 'avatar', maxCount: 1}]), userRegistration);
router.post('/login', userLogin);

router.put('/profile', protect, upload.fields([{ name: 'avatar', maxCount: 1 }]), updateUser);
router.delete('/profile', protect, deleteUser);


module.exports = router;