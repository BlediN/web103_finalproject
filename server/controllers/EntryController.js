import EntryModel from "../models/EntryModel.js";

const EntryController = {
  async getEntries(req, res) {
    try {
      const entries = await EntryModel.getAll();
      res.status(200).json(entries);
    } catch (error) {
      console.error("Error fetching entries:", error);
      res.status(500).json({ error: "Failed to fetch entries" });
    }
  },

  async getEntryById(req, res) {
    try {
      const { entryId } = req.params;
      const entry = await EntryModel.getOne(entryId);

      if (!entry) {
        return res.status(404).json({ error: "Entry not found" });
      }

      res.status(200).json(entry);
    } catch (error) {
      console.error("Error fetching entry:", error);
      res.status(500).json({ error: "Failed to fetch entry" });
    }
  },

  async createEntry(req, res) {
    try {
      const newEntry = await EntryModel.createOne(req.body);
      res.status(201).json(newEntry);
    } catch (error) {
      console.error("Error creating entry:", error);
      res.status(500).json({ error: "Failed to create entry" });
    }
  },

  async updateEntry(req, res) {
    try {
      const { entryId } = req.params;
      const updatedEntry = await EntryModel.updateOne(entryId, req.body);

      if (!updatedEntry) {
        return res.status(404).json({ error: "Entry not found" });
      }

      res.status(200).json(updatedEntry);
    } catch (error) {
      console.error("Error updating entry:", error);
      res.status(500).json({ error: "Failed to update entry" });
    }
  },

  async deleteEntry(req, res) {
    try {
      const { entryId } = req.params;
      const deletedEntry = await EntryModel.deleteOne(entryId);

      if (!deletedEntry) {
        return res.status(404).json({ error: "Entry not found" });
      }

      res.status(200).json({
        message: "Entry deleted successfully",
        deletedEntry,
      });
    } catch (error) {
      console.error("Error deleting entry:", error);
      res.status(500).json({ error: "Failed to delete entry" });
    }
  },
};

export default EntryController;