const AsyncHandler = require('express-async-handler');


const addBookmark = AsyncHandler(async (req, res) => {
  const user = req.account;
  const { type, data } = req.body;

  if (!type || !data) {
    return res.status(400).json({ message: "Missing type or data." });
  }
  const isDuplicate = user.bookmarks.some(
    (bookmark) => bookmark.type === type && (bookmark.data?.url === data?.url || bookmark.data?.id === data?.id)
  );
  if (isDuplicate) {
    return res.status(409).json({ message: "This bookmark already exists." });
  }

  user.bookmarks.push({ type, data });
  await user.save();
  return res.status(201).json({
    message: "Bookmark added.",
    bookmarks: user.bookmarks
  });
});


const getBookmarks = AsyncHandler(async (req, res) => {
  const user = req.account;
  const { type } = req.query;

  const bookmarks = type
    ? user.bookmarks.filter((b) => b.type === type)
    : user.bookmarks;
  return res.status(200).json({
    message: "Bookmarks received.",
    bookmarks
  });
});


const deleteBookmark = AsyncHandler(async (req, res) => {
  const user = req.account;
  const { bookmarkId } = req.params;

  const originalLength = user.bookmarks.length;
  user.bookmarks = user.bookmarks.filter(
    (b) => b._id.toString() !== bookmarkId
  );
  if (user.bookmarks.length === originalLength) {
    return res.status(404).json({ message: "Bookmark not found." });
  }

  await user.save();
  return res.status(200).json({
    message: "Bookmark removed.",
    bookmarks: user.bookmarks
  });
});


module.exports = { addBookmark, getBookmarks, deleteBookmark }