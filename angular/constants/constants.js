
const BASE_URL = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname.split('/')[0] + "prac/";
const SERVER_BASE_URL = BASE_URL + 'index.php/'


const ITEMS_PER_PAGE = 20;
const CUSTOMER = {
    GetCustomers: SERVER_BASE_URL + "Main/getAllCustomers",
    SaveCustomers: SERVER_BASE_URL + "Main/saveCustomer",
}

const Transactions = {
    GetTransactions: SERVER_BASE_URL + "Transactions/getAllTransactions",
    SaveTransaction: SERVER_BASE_URL + "Transactions/saveTransaction",
}

const Reports = {
    GetTransactions: SERVER_BASE_URL + "Reports/getAllTransactions",
    downloadExcel: SERVER_BASE_URL + "Reports/downloadExcel",
    downloadPdf: SERVER_BASE_URL + "Reports/downloadPdf",
}