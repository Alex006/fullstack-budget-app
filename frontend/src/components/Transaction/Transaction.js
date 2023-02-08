import { useCookies } from 'react-cookie';
import { useState, useEffect, useRef } from 'react';
import { Convert } from "easy-currencies";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  ListGroup,
  Table,
} from 'react-bootstrap';



const Transaction = () => {
  
  const [cookies] = useCookies(['auth_token']);
  const txnTypes = [{value: "Income"}, {value: "Expense"}, {value: "Transfer"}]

  const txnTypeRef = useRef();
  const debitAccountRef = useRef();
  const creditAccountRef = useRef();
  const descriptionRef = useRef();
  
  const amountRef = useRef();
  const debitCurrencyRef = useRef();
  const creditCurrencyRef = useRef();
  const searchByBankAccountRef = useRef();

  const [disableSubmit, setDisableSubmit] = useState(false);
  const [userTransactions, setUserTransactions] = useState([]);
  const [userAccounts, setUserAccounts] = useState([]);
  const [userFilteredAccounts, setUserFilteredAccounts] = useState([]);
  const [debitReadOnly, setDebitReadOnly] = useState([]);
  const [creditReadOnly, setCreditReadOnly] = useState([]);

  
  let [txnType, setTxnType] = useState("Select a txn type")
  
  let handleTxnTypeChange = (e) => {
    setTxnType(e.target.value)

    if(txnTypeRef.current.value==="Income"){
      console.log("ITS INCOME");
      setDebitReadOnly(false);
      setCreditReadOnly(true);
      creditAccountRef.current.value = "Select";
    } else if(txnTypeRef.current.value==="Expense"){
      console.log("ITS EXPENSE");
      setDebitReadOnly(true);
      setCreditReadOnly(false);
      debitAccountRef.current.value = "Select";
    } else if(txnTypeRef.current.value==="Transfer"){
      console.log("ITS TRANSFER");
      setDebitReadOnly(false);
      setCreditReadOnly(false);
      creditAccountRef.current.value = "Select";
      debitAccountRef.current.value = "Select";
    }else{
      setDebitReadOnly(true);
      setCreditReadOnly(true);
    }

    debitCurrencyRef.current.value = "";
    creditCurrencyRef.current.value = "";
    descriptionRef.current.value = "";
    amountRef.current.value = "";
  }

  let handleUserAccountChange = (e) => {
    setTxnType(e.target.value)

    if(txnTypeRef.current.value==="Income"){
      console.log("ITS INCOME");
      const userAcctArray = userAccounts.filter(item => item.account_id === parseInt(debitAccountRef.current.value));
      debitCurrencyRef.current.value = userAcctArray[0].currency_id;
    } else if(txnTypeRef.current.value==="Expense"){
      console.log("ITS EXPENSE");
      const userAcctArray = userAccounts.filter(item => item.account_id === parseInt(creditAccountRef.current.value));
      creditCurrencyRef.current.value = userAcctArray[0].currency_id;
    } else if(txnTypeRef.current.value==="Transfer"){
      console.log("ITS TRANSFER");

      let userAcctArray = userAccounts.filter(item => item.account_id === parseInt(debitAccountRef.current.value));
      if(userAcctArray.length>0){
        debitCurrencyRef.current.value = userAcctArray[0].currency_id;
      }
      
      userAcctArray = userAccounts.filter(item => item.account_id === parseInt(creditAccountRef.current.value));
      if(userAcctArray.length>0){
        creditCurrencyRef.current.value = userAcctArray[0].currency_id;
      }

      setDebitReadOnly(false);
      setCreditReadOnly(false);
    }else{
      setDebitReadOnly(true);
      setCreditReadOnly(true);
    }

  }

  const getTransactions = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/transaction`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.auth_token}`,
        },
      }
    );
    const transactions = await response.json();
    return transactions;
  };

  const getAccounts = async (body) => {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/account`,
          {
              method: 'GET',
              headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${cookies.auth_token}`,
              },
          }
      );
      body: JSON.stringify(body);
      const accounts = await response.json(); 
      return accounts; 
  }; 

  const getTransactionsByAccountId = async (searchBankAccount) => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/transaction/bankAccount/${searchBankAccount}`,
        {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookies.auth_token}`,
            },
        }
    );
    const transactions = await response.json(); 

    console.log("getTransactionsByAccountId!!!!", searchBankAccount, transactions)
    return transactions; 
}; 

  const createTransaction = async (body) => {
    console.log("createTransaction!!!!", body)

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/transaction`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.auth_token}`,
        },
        body: JSON.stringify(body),
      }
    );
    await response.json();
  };
  
  const onSubmitSearchHandler = async (e) => {
    e.preventDefault();

    try {
      const searchByBankAccount = searchByBankAccountRef.current.value;
      console.log(searchByBankAccount);

      const transactions = await getTransactionsByAccountId(searchByBankAccount);
      setUserTransactions(transactions.data);
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    const txnType = txnTypeRef.current.value;
    let debitAccount = debitAccountRef.current.value;
    let creditAccount = creditAccountRef.current.value;

    if(debitAccount === 'Select') debitAccount = null;
    if(creditAccount === 'Select') creditAccount = null;

    const description = descriptionRef.current.value;
    const accountNumber = (txnType=== "Income" || txnType=== "Transfer"   ? debitAccount : creditAccount);
    let amount = amountRef.current.value;
    amount = (txnType=== "Expense"? amount *-1: amount);
    const debitCurrency = debitCurrencyRef.current.value;
    const creditCurrency = creditCurrencyRef.current.value;
    const emptyValue = "";

    if (txnType === 'Select' || (debitAccount === 'Select' && creditAccount === 'Select') || amount === ''){
      console.log("VALIDATION FAILED");
       return; 
    } 
    setDisableSubmit(true);
    try {

      if(txnType === 'Transfer'){
        //account that is tranfering
        amount = amount *-1;
        await createTransaction({ debitAccount, emptyValue, description, accountNumber, amount, debitCurrency, emptyValue });
        
        //account that will recive the transfer
        amount = amount *-1;
        amount = await Convert(amount).from(debitCurrency).to(creditCurrency);
        await createTransaction({ emptyValue, creditAccount, description, accountNumber, amount, emptyValue, creditCurrency });
        
      }else{
        await createTransaction({ debitAccount, creditAccount, description, accountNumber, amount, debitCurrency, creditCurrency });
      }

      const transactions = await getTransactions();
      setUserTransactions(transactions.data);
    } catch (error) {
      console.log(error);
    }
    setDisableSubmit(false);
    
    txnTypeRef.current.value = '';
    debitAccountRef.current.value = '';
    creditAccountRef.current.value = '';
    descriptionRef.current.value = '';
    amountRef.current.value = '';
    debitCurrencyRef.current.value = '';
    creditCurrencyRef.current.value = '';
    
  };

  useEffect(() => {
    const getAllUserTransactions = async () => {
      const transactions = await getTransactions();
      console.log(transactions);
      setUserTransactions(transactions.data);
    };

    const getAllUserAccounts = async () => {
      const userAccounts = await getAccounts();
      setUserAccounts(userAccounts.data);
    };

    getAllUserTransactions();
    getAllUserAccounts();
  
  }, []);

  const userTransactionsList = userTransactions.map((transaction) => {
    return (
      <tr>
        <td>{transaction.txnId}</td>
        <td>{transaction.debitAccount}</td>
        <td>{transaction.creditAccount}</td>
        <td>{transaction.description}</td>
        <td>{transaction.amount}</td>
        <td>{transaction.debitCurrency}</td>
        <td>{transaction.creditCurrency}</td>
      </tr>
    );
  });

  return (
    <Container fluid className="mt-5">
      <div align="center">
        <h1>Transactions</h1>
      </div>
      <Row className="align-items-center justify-content-center">
        <Col
          md={5}
          className="d-flex align-items-center justify-content-center"
        >
          <Card style={{ width: "25rem" }}>
            <Card.Body>
              <Form onSubmit={onSubmitHandler}>
                <Row className="mb-3">
                  <Form.Group as={Row} controlId="formGridEmail">
                    <Col>
                      <Form.Label>Transaction Type</Form.Label>
                    </Col>
                    <Col>
                      <Form.Select onChange={handleTxnTypeChange} ref={txnTypeRef} >
                        <option value="Select">Select...</option>
                        {txnTypes.map((txnType) => (
                          <option value={txnType.value}>{txnType.value}</option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Row} controlId="formGridEmail">
                    <Col>
                      <Form.Label>Debit Account</Form.Label>
                    </Col>
                    <Col>
                      <Form.Select onChange={handleUserAccountChange} ref={debitAccountRef} disabled={debitReadOnly} >
                        <option value="Select">Select...</option>
                        {userAccounts.map((account) => (
                          <option value={account.account_id}>
                            {account.account_id}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Row} controlId="formGridEmail">
                    <Col><Form.Label>Credit Account</Form.Label></Col>
                    <Col>
                      <Form.Select onChange={handleUserAccountChange} ref={creditAccountRef} disabled={creditReadOnly} >
                        <option value="Select">Select...</option>
                        {userAccounts.map((account) => (
                          <option value={account.account_id}>
                            {account.account_id}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Row} controlId="formGridEmail">
                    <Col>
                      <Form.Label>Ref. Description</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control placeholder="" ref={descriptionRef} />
                    </Col>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Row} controlId="formGridEmail">
                    <Col>
                      <Form.Label>Amount</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control placeholder="" ref={amountRef} />
                    </Col>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Row} controlId="formGridEmail">
                    <Col>
                      <Form.Label>Debit Currency</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        placeholder=""
                        ref={debitCurrencyRef}
                        disabled
                      />
                    </Col>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Row} controlId="formGridEmail">
                    <Col>
                      <Form.Label>Credit Currency</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        placeholder=""
                        ref={creditCurrencyRef}
                        disabled
                      />
                    </Col>
                  </Form.Group>
                </Row>
                <Row className="mb-3 justify-content-end">
                  <Col className="d-flex justify-content-end">
                    <Button
                      disabled={disableSubmit}
                      variant="outline-success"
                      type="submit"
                      style={{ width: "100%" }}
                    >
                      {disableSubmit && (
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                      Create transaction
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5}>
          <h2>History</h2>
          
              <Form onSubmit={onSubmitSearchHandler}>
                <Row className="mb-3">
                  <Form.Group as={Row} controlId="formGridEmail">
                    <Col><Form.Label>Bank Account</Form.Label></Col>
                    <Col><Form.Control placeholder="" ref={searchByBankAccountRef} /></Col>
                    <Col><Button variant="outline-success" type="submit" style={{ width: "100%" }} > Search</Button> </Col>
                  </Form.Group>
                </Row>
              </Form>
        
          <Table striped bordered hover size="sm" responsive>
            <thead>
              <tr>
                <th>Txn Id</th>
                <th>Debit Account</th>
                <th>Credit Account</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Debit Currency</th>
                <th>Credit Currency</th>
              </tr>
            </thead>
            <tbody>{userTransactionsList}</tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};
export default Transaction;
