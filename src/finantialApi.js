const { response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();

const customers = [];
app.use(express.json());

//-------- Middleware -------- //
const verifyExistsAccountCPF = (req, res, next) => {
  const { cpf } = req.headers;
  const customersAlreadyExists = customers.find(
    (customer) => customer.cpf === cpf
  );
  if (!customersAlreadyExists) {
    return res.status(400).json({ error: "Customer not found!" });
  }
  req.customer = customersAlreadyExists;
  return next();
};
//-------- Middleware Use -------- //
//Se eu colocar da forma como está abaixo tudo que eu colocar abaixo do app.use ira usar o middleware
// app.use(verifyExistsAccountCPF)

//-------- Create Account -------- //
app.post("/account", (req, res) => {
  const { cpf, name } = req.body;
  const id = uuidv4();
  const customersAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );
  if (customersAlreadyExists) {
    res.status(400).json({ error: "Customer already exists!" });
  }
  customers.push({
    cpf,
    name,
    id,
    statement: [],
  });
  return res.status(201).send();
});
//-------- Consult Statement -------- //
app.get("/statementbyparams/:cpf", verifyExistsAccountCPF, (req, res) => {
  const { customer } = req;
  return res.json(customer.statement);
});
//-------- Verify Token(CPF) -------- //
app.get("/statementbyheader/", verifyExistsAccountCPF, (req, res) => {
  const { customer } = req;
  return res.json(customer.statement);
});
//-------- Deposit -------- //
app.post("/deposit", verifyExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;
  const { customer } = req;
  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };
  customer.statement.push(statementOperation);
  return res.status(201).send();
});
//-------- Consult Statement by Date -------- //

app.get("/statementbydate/", verifyExistsAccountCPF, (req, res) => {
  const { customer } = req;
  const { date } = req.query;
  console.log(date);
  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter(
    (statement) =>
      statement.created_at.toDateString() ===
      new Date(dateFormat).toDateString()
  );
  return res.json(statement).send();
});
//-------- User Update -------- //
app.patch("/account", verifyExistsAccountCPF, (req, res) => {
  const { name } = req.body;
  const { customer } = req;

  customer.name = name;

  return res.status(201).send();
});
//-------- User infos -------- //

app.get("/account", verifyExistsAccountCPF, (req, res) => {
  const { amount } = req.body;
  const { customer } = req;
  const balance = customer.statement.reduce((a, b) => {
    if (b.type == "credit") {
      return a + b.amount;
    } else {
      return a - b.amount;
    }
  }, 0);

  return res.status(200).json(customer).send();
});
//-------- Delete User -------- //
app.delete("/account", verifyExistsAccountCPF, (req, res) => {
  const { customer } = req;

  customers.splice(customer, 1);
  return res.status(200).json(customers);
});
//-------- User Withdraw -------- //
app.post("/withdraw", verifyExistsAccountCPF, async (req, res) => {
  const { description, amount } = req.body;
  const { customer } = req;
  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "debit",
  };
  customer.statement.push(statementOperation);
  const balance = await customer.statement.reduce((a, b) => {
    if (b.type == "credit") {
      return a + b.amount;
    } else {
      return a - b.amount;
    }
  }, 0);
  return res.status(200).json({ balance: balance });
});

//-------- Balance User -------- //
app.get("/balance", verifyExistsAccountCPF, (req, res) => {
  const { customer } = req;

  const balance = customer.statement.reduce((a, b) => {
    if (b.type == "credit") {
      return a + b.amount;
    } else {
      return a - b.amount;
    }
  }, 0);

  return res.status(200).json({ balance: balance });
});

app.listen(2580);
