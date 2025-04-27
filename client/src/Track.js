import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"
// import {QRCode} from 'qrcode.react'
import { QRCodeCanvas } from 'qrcode.react';

function Track() {
    const history = useHistory()
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [FOOD, setFOOD] = useState();
    const [FoodStage, setFoodStage] = useState();
    const [ID, setID] = useState();
    const [RMS, setRMS] = useState();
    const [MAN, setMAN] = useState();
    const [DIS, setDIS] = useState();
    const [RET, setRET] = useState();
    const [TrackTillSold, showTrackTillSold] = useState(false);
    const [TrackTillRetail, showTrackTillRetail] = useState(false);
    const [TrackTillDistribution, showTrackTillDistribution] = useState(false);
    const [TrackTillManufacture, showTrackTillManufacture] = useState(false);
    const [TrackTillRMS, showTrackTillRMS] = useState(false);
    const [TrackTillOrdered, showTrackTillOrdered] = useState(false);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
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
            var i;
            const foodCtr = await supplychain.methods.foodCtr().call();
            const food = {};
            const foodStage = [];
            for (i = 0; i < foodCtr; i++) {
                food[i + 1] = await supplychain.methods.FoodStock(i + 1).call();
                foodStage[i + 1] = await supplychain.methods.showStage(i + 1).call();
            }
            setFOOD(food);
            setFoodStage(foodStage);
            const rmsCtr = await supplychain.methods.rmsCtr().call();
            const rms = {};
            for (i = 0; i < rmsCtr; i++) {
                rms[i + 1] = await supplychain.methods.RMS(i + 1).call();
            }
            setRMS(rms);
            const manCtr = await supplychain.methods.manCtr().call();
            const man = {};
            for (i = 0; i < manCtr; i++) {
                man[i + 1] = await supplychain.methods.MAN(i + 1).call();
            }
            setMAN(man);
            const disCtr = await supplychain.methods.disCtr().call();
            const dis = {};
            for (i = 0; i < disCtr; i++) {
                dis[i + 1] = await supplychain.methods.DIS(i + 1).call();
            }
            setDIS(dis);
            const retCtr = await supplychain.methods.retCtr().call();
            const ret = {};
            for (i = 0; i < retCtr; i++) {
                ret[i + 1] = await supplychain.methods.RET(i + 1).call();
            }
            setRET(ret);
            setloader(false);
        }
        else {
            window.alert('The smart contract is not deployed to current network')
        }
    }
    if (loader) {
        return (
            <div>
                <h1 className="wait">Loading...</h1>
            </div>
        )
    }
    if (TrackTillSold) {
        return (
            <div className="container-xl">
                <article className="col-4">
                    <h3><b><u>Food:</u></b></h3>
                    <span><b>Food ID: </b>{FOOD[ID].id}</span>
                    <br />
                    <span><b>Name:</b> {FOOD[ID].name}</span>
                    <br />
                    <span><b>Description: </b>{FOOD[ID].description}</span>
                    <br />
                    <span><b>Current stage: </b>{FoodStage[ID]}</span>
                </article>
                <hr />
                <br />
                <section className="row">

                    <article className="col-3">
                        <h4><u>Raw Materials Supplied by:</u></h4>
                        <p><b>Supplier ID: </b>{RMS[FOOD[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[FOOD[ID].RMSid].name}</p>
                        <p><b>Place: </b>{RMS[FOOD[ID].RMSid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Manufactured by:</u></h4>
                        <p><b>Manufacturer ID: </b>{MAN[FOOD[ID].MANid].id}</p>
                        <p><b>Name:</b> {MAN[FOOD[ID].MANid].name}</p>
                        <p><b>Place: </b>{MAN[FOOD[ID].MANid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Distributed by:</u></h4>
                        <p><b>Distributor ID: </b>{DIS[FOOD[ID].DISid].id}</p>
                        <p><b>Name:</b> {DIS[FOOD[ID].DISid].name}</p>
                        <p><b>Place: </b>{DIS[FOOD[ID].DISid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Retailed by:</u></h4>
                        <p><b>Retailer ID: </b>{RET[FOOD[ID].RETid].id}</p>
                        <p><b>Name:</b> {RET[FOOD[ID].RETid].name}</p>
                        <p><b>Place: </b>{RET[FOOD[ID].RETid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Sold</u></h4>
                    </article>
                </section>
                <button onClick={() => {
                    showTrackTillSold(false);
                }} className="btn btn-outline-success btn-sm">Track Another Item</button>
                <span onClick={() => {
                    history.push('/')
                }} className="btn btn-outline-danger btn-sm"> HOME</span>
            </div >
        )
    }
    if (TrackTillRetail) {
        return (
            <div className="container-xl">
                <article className="col-4">
                    <h3><b><u>Food:</u></b></h3>
                    <span><b>Food ID: </b>{FOOD[ID].id}</span>
                    <br />
                    <span><b>Name:</b> {FOOD[ID].name}</span>
                    <br />
                    <span><b>Description: </b>{FOOD[ID].description}</span>
                    <br />
                    <span><b>Current stage: </b>{FoodStage[ID]}</span>
                </article>
                <hr />
                <br />
                <section className="row">

                    <article className="col-3">
                        <h4><u>Raw Materials Supplied by:</u></h4>
                        <p><b>Supplier ID: </b>{RMS[FOOD[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[FOOD[ID].RMSid].name}</p>
                        <p><b>Place: </b>{RMS[FOOD[ID].RMSid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Manufactured by:</u></h4>
                        <p><b>Manufacturer ID: </b>{MAN[FOOD[ID].MANid].id}</p>
                        <p><b>Name:</b> {MAN[FOOD[ID].MANid].name}</p>
                        <p><b>Place: </b>{MAN[FOOD[ID].MANid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Distributed by:</u></h4>
                        <p><b>Distributor ID: </b>{DIS[FOOD[ID].DISid].id}</p>
                        <p><b>Name:</b> {DIS[FOOD[ID].DISid].name}</p>
                        <p><b>Place: </b>{DIS[FOOD[ID].DISid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Retailed by:</u></h4>
                        <p><b>Retailer ID: </b>{RET[FOOD[ID].RETid].id}</p>
                        <p><b>Name:</b> {RET[FOOD[ID].RETid].name}</p>
                        <p><b>Place: </b>{RET[FOOD[ID].RETid].place}</p>
                    </article>
                </section>
                <button onClick={() => {
                    showTrackTillRetail(false);
                }} className="btn btn-outline-success btn-sm">Track Another Item</button>
                <span onClick={() => {
                    history.push('/')
                }} className="btn btn-outline-danger btn-sm"> HOME</span>
            </div >
        )
    }
    if (TrackTillDistribution) {
        return (
            <div className="container-xl">
                <article className="col-4">
                    <h3><b><u>Food:</u></b></h3>
                    <span><b>Food ID: </b>{FOOD[ID].id}</span>
                    <br />
                    <span><b>Name:</b> {FOOD[ID].name}</span>
                    <br />
                    <span><b>Description: </b>{FOOD[ID].description}</span>
                    <br />
                    <span><b>Current stage: </b>{FoodStage[ID]}</span>
                </article>
                <hr />
                <br />
                <section className="row">

                    <article className="col-3">
                        <h4><u>Raw Materials Supplied by:</u></h4>
                        <p><b>Supplier ID: </b>{RMS[FOOD[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[FOOD[ID].RMSid].name}</p>
                        <p><b>Place: </b>{RMS[FOOD[ID].RMSid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Manufactured by:</u></h4>
                        <p><b>Manufacturer ID: </b>{MAN[FOOD[ID].MANid].id}</p>
                        <p><b>Name:</b> {MAN[FOOD[ID].MANid].name}</p>
                        <p><b>Place: </b>{MAN[FOOD[ID].MANid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Distributed by:</u></h4>
                        <p><b>Distributor ID: </b>{DIS[FOOD[ID].DISid].id}</p>
                        <p><b>Name:</b> {DIS[FOOD[ID].DISid].name}</p>
                        <p><b>Place: </b>{DIS[FOOD[ID].DISid].place}</p>
                    </article>
                </section>
                <button onClick={() => {
                    showTrackTillDistribution(false);
                }} className="btn btn-outline-success btn-sm">Track Another Item</button>
                <span onClick={() => {
                    history.push('/')
                }} className="btn btn-outline-danger btn-sm"> HOME</span>
            </div >
        )
    }
    if (TrackTillManufacture) {
        return (
            <div className="container-xl">
                <article className="col-4">
                    <h3><b><u>Food:</u></b></h3>
                    <span><b>Food ID: </b>{FOOD[ID].id}</span>
                    <br />
                    <span><b>Name:</b> {FOOD[ID].name}</span>
                    <br />
                    <span><b>Description: </b>{FOOD[ID].description}</span>
                    <br />
                    <span><b>Current stage: </b>{FoodStage[ID]}</span>
                </article>
                <hr />
                <br />
                <section className="row">

                    <article className="col-3">
                        <h4><u>Raw Materials Supplied by:</u></h4>
                        <p><b>Supplier ID: </b>{RMS[FOOD[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[FOOD[ID].RMSid].name}</p>
                        <p><b>Place: </b>{RMS[FOOD[ID].RMSid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Manufactured by:</u></h4>
                        <p><b>Manufacturer ID: </b>{MAN[FOOD[ID].MANid].id}</p>
                        <p><b>Name:</b> {MAN[FOOD[ID].MANid].name}</p>
                        <p><b>Place: </b>{MAN[FOOD[ID].MANid].place}</p>
                    </article>
                </section>
                <button onClick={() => {
                    showTrackTillManufacture(false);
                }} className="btn btn-outline-success btn-sm">Track Another Item</button>
                <span onClick={() => {
                    history.push('/')
                }} className="btn btn-outline-danger btn-sm"> HOME</span>
            </div >
        )
    }
    if (TrackTillRMS) {
        return (
            <div className="container-xl">
                <article className="col-4">
                    <h3><b><u>Food:</u></b></h3>
                    <span><b>Food ID: </b>{FOOD[ID].id}</span>
                    <br />
                    <span><b>Name:</b> {FOOD[ID].name}</span>
                    <br />
                    <span><b>Description: </b>{FOOD[ID].description}</span>
                    <br />
                    <span><b>Current stage: </b>{FoodStage[ID]}</span>
                </article>
                <hr />
                <br />
                <section className="row">

                    <article className="col-3">
                        <h4><u>Raw Materials Supplied by:</u></h4>
                        <p><b>Supplier ID: </b>{RMS[FOOD[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[FOOD[ID].RMSid].name}</p>
                        <p><b>Place: </b>{RMS[FOOD[ID].RMSid].place}</p>
                    </article>
                </section>
                <button onClick={() => {
                    showTrackTillRMS(false);
                }} className="btn btn-outline-success btn-sm">Track Another Item</button>
                <span onClick={() => {
                    history.push('/')
                }} className="btn btn-outline-danger btn-sm"> HOME</span>
            </div >
        )
    }
    if (TrackTillOrdered) {
      const batteryData = {
        id: FOOD[ID]?.id,
        name: FOOD[ID]?.name,
        description: FOOD[ID]?.description,
        currentStage: FoodStage[ID]
      };

      const batteryDataString = JSON.stringify(batteryData);
        return (
            <div className="container-xl">
                <article className="col-4">
                    <h3><b><u>FOOD SUPPLY:</u></b></h3>
                    <span><b>Food ID: </b>{FOOD[ID].id}</span>
                    <br />
                    <span><b>Name:</b> {FOOD[ID].name}</span>
                    <br />
                    <span><b>Description: </b>{FOOD[ID].description}</span>
                    <br />
                    <span><b>Current stage: </b>{FoodStage[ID]}</span>
                    <hr />
                    <br />
                    <h5>Food Not Yet Processed...</h5>
                    <button onClick={() => {
                        showTrackTillOrdered(false);
                    }} className="btn btn-outline-success btn-sm">Track Another Item</button>
                    <span onClick={() => {
                        history.push('/')
                    }} className="btn btn-outline-danger btn-sm"> HOME</span>
                </article>
                {/* <section className="row">
                    
                    <article className="col-3">
                        <h4><u>Raw Materials Supplied by:</u></h4>
                        <p><b>Supplier ID: </b>{RMS[MED[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Place: </b>{RMS[MED[ID].RMSid].place}</p>
                    </article>
                </section> */}
                <div className="qr-code-container">
                    <h4>QR Code:</h4>
                    <QRCodeCanvas value={batteryDataString} />
                </div>
            </div >


        )
    }
    const handlerChangeID = (event) => {
        setID(event.target.value);
    }
    const redirect_to_home = () => {
        history.push('/')
    }
    const handlerSubmit = async (event) => {
        event.preventDefault();
        var ctr = await SupplyChain.methods.foodCtr().call();
        if (!((ID > 0) && (ID <= ctr)))
            alert("Invalid Food ID!!!");
        else {
            // eslint-disable-next-line
            if (FOOD[ID].stage == 5)
                showTrackTillSold(true);
            // eslint-disable-next-line
            else if (FOOD[ID].stage == 4)
                showTrackTillRetail(true);
            // eslint-disable-next-line
            else if (FOOD[ID].stage == 3)
                showTrackTillDistribution(true);
            // eslint-disable-next-line
            else if (FOOD[ID].stage == 2)
                showTrackTillManufacture(true);
            // eslint-disable-next-line
            else if (FOOD[ID].stage == 1)
                showTrackTillRMS(true);
            else
                showTrackTillOrdered(true);

        }
    }

    return (
        <div>
            <span><b>Current Account Address:</b> {currentaccount}</span>
            <span onClick={redirect_to_home} className="btn btn-outline-danger btn-sm"> HOME</span>
            <table className="table table-sm table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Food ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Current Processing Stage</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(FOOD).map(function (key) {
                        return (
                            <tr key={key}>
                                <td>{FOOD[key].id}</td>
                                <td>{FOOD[key].name}</td>
                                <td>{FOOD[key].description}</td>
                                <td>
                                    {
                                        FoodStage[key]
                                    }
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <h5>Enter Food ID to Track it</h5>

            <form onSubmit={handlerSubmit}>
                <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Enter Food ID" required />
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmit}>Track</button>
            </form>
        </div>
    )
}

export default Track
