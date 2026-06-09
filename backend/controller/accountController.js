import Account from "../model/Account.js";

// CREATE
export const createAccount = async (req, res) => {
  try {
    const account = await Account.create(req.body);
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL (Pagination + Search + Filter)
export const getAccounts = async (req, res) => {
  try {
    const { page = 1, limit = 5, search, type } = req.query;

    const query = {};

    // search by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // filter by type (bank/cash)
    if (type) {
      query.type = type;
    }

    const skip = (page - 1) * limit;

    const accounts = await Account.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Account.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: accounts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE
export const getAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteAccount = async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    res.json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};