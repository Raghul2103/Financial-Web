import Transaction from "../model/Transaction.js";
import Account from "../model/Account.js";

export const addIncome = async (req, res) => {
  try {
    const { amount, accountId, category, note, date } = req.body;

    if (!amount || !accountId) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    account.balance += amount;
    await account.save();

    const transaction = await Transaction.create({
      type: "income",
      amount,
      accountId,
      category,
      note,
      date,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getIncome = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      accountId,
      category,
      startDate,
      endDate,
    } = req.query;

    const query = { type: "income" };

    if (accountId) query.accountId = accountId;
    if (category) query.category = category;

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const skip = (page - 1) * limit;

    const data = await Transaction.find(query)
      .populate("accountId")
      .skip(skip)
      .limit(Number(limit))
      .sort({ date: -1 });

    const total = await Transaction.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    const account = await Account.findById(transaction.accountId);

    const diff = req.body.amount - transaction.amount;

    account.balance += diff;
    await account.save();

    transaction.amount = req.body.amount;
    transaction.note = req.body.note;

    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    const account = await Account.findById(transaction.accountId);

    account.balance -= transaction.amount;
    await account.save();

    await transaction.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const transferAmount = async (req, res) => {
  try {
    const { fromAccountId, toAccountId, amount, note } = req.body;

    if (fromAccountId === toAccountId) {
      return res.status(400).json({ message: "Same account not allowed" });
    }

    const from = await Account.findById(fromAccountId);
    const to = await Account.findById(toAccountId);

    if (!from || !to) {
      return res.status(404).json({ message: "Account not found" });
    }

    from.balance -= amount;
    to.balance += amount;

    await from.save();
    await to.save();

    const tx = await Transaction.create({
      type: "transfer",
      amount,
      fromAccountId,
      toAccountId,
      note,
    });

    res.status(201).json(tx);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};