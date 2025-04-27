import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"

function AddFood() {
    const history = useHistory()
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [FOOD, setFOOD] = useState({});
    const [FoodName, setFoodName] = useState("");
    const [FoodDes, setFoodDes] = useState("");
    const [FoodStage, setFoodStage] = useState([]);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' }); // modern way
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
        }
    };

    const loadBlockchaindata = async () => {
        setloader(true);
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setCurrentaccount(account);
        const networkId = await web3.eth.net.getId();
        const networkData = SupplyChainABI.networks[networkId];
        if (networkData) {
            const supplychain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
            setSupplyChain(supplychain);
            const foodCtr = await supplychain.methods.foodCtr().call(); 
            const food = {};
            const foodStage = [];
            for (let i = 0; i < foodCtr; i++) {
                food[i] = await supplychain.methods.FoodStock(i + 1).call();
                foodStage[i] = await supplychain.methods.showStage(i + 1).call();
            }
            setFOOD(food);
            setFoodStage(foodStage);
            setloader(false);
        } else {
            window.alert('The smart contract is not deployed to current network');
        }
    }

    if (loader) {
        return (
            <div style={styles.container}>
                <h1 className="wait">Loading...</h1>
            </div>
        )
    }

    const redirect_to_home = () => {
        history.push('/')
    }

    const handlerChangeNameFOOD = (event) => {
        setFoodName(event.target.value);
    }

    const handlerChangeDesFOOD = (event) => {
        setFoodDes(event.target.value);
    }

    const handlerSubmitFOOD = async (event) => {
        event.preventDefault();
        try {
            const reciept = await SupplyChain.methods.addFood(FoodName, FoodDes).send({ from: currentaccount }); // Still uses addMedicine
            if (reciept) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert("An error occurred!!!");
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.header}>
                    <span><b>Current Account Address:</b> {currentaccount}</span>
                    <span onClick={redirect_to_home} className="btn btn-outline-danger btn-sm" style={styles.homeButton}>HOME</span>
                </div>
                <br />
                <h5>Add Food Order:</h5>
                <form onSubmit={handlerSubmitFOOD} style={styles.form}>
                    <input className="form-control-sm" type="text" onChange={handlerChangeNameFOOD} placeholder="Food Name" required />
                    <input className="form-control-sm" type="text" onChange={handlerChangeDesFOOD} placeholder="Food Description" required />
                    <button className="btn btn-outline-success btn-sm" style={styles.submitButton}>Order</button>
                </form>
                <br />
                <h5>Ordered Food Items:</h5>
                <table className="table table-bordered" style={styles.table}>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Current Stage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(FOOD).map((key) => (
                            <tr key={key}>
                                <td>{FOOD[key].id}</td>
                                <td>{FOOD[key].name}</td>
                                <td>{FOOD[key].description}</td>
                                <td>{FoodStage[key]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f0f4c3 30%, #c5e1a5 90%)',
        padding: '20px'
    },
    content: {
        backgroundColor: '#ffffffcc',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
        maxWidth: '700px',
        width: '100%',
        textAlign: 'center'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    homeButton: {
        marginLeft: 'auto',
        cursor: 'pointer'
    },
    form: {
        marginBottom: '20px'
    },
    submitButton: {
        marginTop: '10px'
    },
    table: {
        marginTop: '20px'
    }
}

export default AddFood;
