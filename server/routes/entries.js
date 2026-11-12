import express from "express";
import EntryController from "../controllers/EntryController.js";

const router = express.Router();

router.get("/", EntryController.getEntries);
router.post("/import/gdelt", EntryController.importNewsFeed);
router.post("/import/news", EntryController.importNewsFeed);
router.get("/:entryId", EntryController.getEntryById);
router.post("/", EntryController.createEntry);
router.patch("/:entryId", EntryController.updateEntry);
router.delete("/:entryId", EntryController.deleteEntry);

export default router;