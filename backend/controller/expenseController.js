import Transaction from "../model/Transaction.js";
import Account from "../model/Account.js";

// ✅ CREATE EXPENSE
export const addExpense = async (req, res) => {
  try {
    const { amount, accountId, category, note, date } = req.body;

    if (!amount || !accountId) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // ❌ Prevent negative balance
    if (account.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 🔻 Deduct balance
    account.balance -= amount;
    await account.save();

    // 💾 Save transaction
    const transaction = await Transaction.create({
      type: "expense",
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



// ✅ GET EXPENSE (Pagination + Filter)
export const getExpense = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      accountId,
      category,
      startDate,
      endDate,
    } = req.query;

    const query = { type: "expense" };

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



// ✅ UPDATE EXPENSE
export const updateExpense = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const account = await Account.findById(transaction.accountId);

    // 🔁 Difference calculation
    const diff = req.body.amount - transaction.amount;

    // ❌ Prevent negative balance
    if (account.balance < diff) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 🔻 Adjust balance
    account.balance -= diff;
    await account.save();

    transaction.amount = req.body.amount;
    transaction.category = req.body.category;
    transaction.note = req.body.note;
    transaction.date = req.body.date;

    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ DELETE EXPENSE (Refund balance)
export const deleteExpense = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const account = await Account.findById(transaction.accountId);

    // 🔄 Refund amount
    account.balance += transaction.amount;
    await account.save();

    await transaction.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};