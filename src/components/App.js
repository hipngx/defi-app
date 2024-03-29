import React, { Component } from "react";
import Navbar from "./Navbar";
import Web3 from "web3";
import "./App.css";
import Main from "./Main";
import Admin from "./Admin";
import Tether from "../truffle_abis/Tether.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";
import ParticleSettings from "./ParticleSettings";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.checkAdmin();
    await this.loadAdminData();
    this.setState({ loading: false });
  }

  componentDidMount() {
    // change when account change
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("message", (message) => {
        window.location.reload();
        console.log("message", message);
      });
      window.ethereum.on("error", (error) => {
        console.log("errorrrr", error);
      });
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();

    //LOAD Tether TOKEN
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      this.setState({ tether });
      let tetherBalance = await tether.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ tetherBalance: tetherBalance.toString() });
    } else {
      window.alert("tether contract not deployed to detect network");
    }

    //LOAD RWD TOKEN
    const rwdTokenData = RWD.networks[networkId];
    if (rwdTokenData) {
      const rwd = new web3.eth.Contract(RWD.abi, rwdTokenData.address);
      this.setState({ RWD });
      let rwdTokenBalance = await rwd.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ rwdTokenBalance: rwdTokenBalance.toString() });
    } else {
      window.alert("Reward Token contract not deployed to detect network");
    }

    //Load DecentralBank
    const decentralBankData = DecentralBank.networks[networkId];
    if (decentralBankData) {
      const decentralBank = new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address
      );
      this.setState({ decentralBank });
      let stakingBalance = await decentralBank.methods
        .stakingBalance(this.state.account)
        .call();
      this.setState({ stakingBalance: stakingBalance.toString() });
      let owner = await decentralBank.methods.owner().call();
      this.setState({ ownerAdd: owner });
    } else {
      window.alert("TokenForm contract not deployed to detect network");
    }
    this.setState({ loading: false });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non ethereum browser detected. You should consider Metamask!"
      );
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true });
    this.state.tether.methods
      .approve(this.state.decentralBank._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.decentralBank.methods
          .depositTokens(amount)
          .send({ from: this.state.account })
          .on("transactionHash", async (hash) => {
            await this.loadBlockchainData();
            this.setState({ loading: false });
          })
          .on("error", (err) => {
            console.log("err", err);
            window.alert("error when transaction. Code: ", err.code.toString());
            this.setState({ loading: false });
          });
      })
      .on("error", (err) => {
        console.log("err", err);
        window.alert("error when transaction. Code: ", err.code.toString());
        this.setState({ loading: false });
      });
  };

  unstakeTokens = () => {
    this.setState({ loading: true });
    this.state.decentralBank.methods
      .unstakeTokens()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.loadBlockchainData();
        this.setState({ loading: false });
      });
  };

  checkAdmin = async () => {
    if (this.state.ownerAdd === this.state.account) {
      this.setState({ isOwner: true });
    } else {
      this.setState({ isOwner: false });
    }
  };

  loadAdminData = async () => {
    this.setState({ loading: true });
    let stakerArray = [];
    if (this.state.isOwner) {
      const stakers = await this.state.decentralBank.methods.getStaker().call();
      if (stakers.length !== 0) {
        for (const staker of stakers) {
          const getStakingBalance = await this.state.decentralBank.methods
            .getStakingBalance(staker.toString())
            .call();
          stakerArray.push({
            address: staker.toString(),
            amount: window.web3.utils.fromWei(getStakingBalance),
          });
        }
      }
      this.setState({ stakerArray });
      console.log("stakers state", this.state.stakerArray);
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      tether: {},
      rwd: {},
      decentralBank: {},
      tetherBalance: "0",
      rwdTokenBalance: "0",
      stakingBalance: "0",
      loading: true,
      ownerAdd: "0x0",
      isOwner: false,
      stakerArray: [],
    };
  }

  issueToken = () => {
    this.setState({ loading: true });
    this.state.decentralBank.methods
      .issueTokens()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.loadBlockchainData();
        this.setState({ loading: false });
      });
  };

  buyTether = (amount) => {
    // this.setState({ loading: true });
    // this.state.decentralBank.methods
    //   .buyToken(amount)
    //   .send({ from: this.state.account, value: Number(amount) / 10 })
    //   .on("transactionHash", (hash) => {
    //     this.loadBlockchainData();
    //     this.setState({ loading: false });
    //   });
  };

  render() {
    let content;
    let admin;
    {
      this.state.loading
        ? (content = (
            <p
              id="loader"
              className="text-center"
              style={{ color: "white", marginTop: "5rem" }}
            >
              LOADING PLEASE...
            </p>
          ))
        : (content = (
            <Main
              tetherBalance={this.state.tetherBalance}
              rwdBalance={this.state.rwdTokenBalance}
              stakingBalance={this.state.stakingBalance}
              stakeTokens={this.stakeTokens}
              buyTether={this.buyTether}
              unstakeTokens={this.unstakeTokens}
              decentralBankContract={this.state.decentralBank}
              isOwner={this.state.isOwner}
              stakerArray={this.state.stakerArray}
              issueToken={this.issueToken}
            />
          ));
    }

    {
      this.state.loading
        ? (admin = (
            <p
              id="loader"
              className="text-center"
              style={{ color: "white", marginTop: "5rem" }}
            >
              LOADING PLEASE...
            </p>
          ))
        : (admin = (
            <Admin
              tetherBalance={this.state.tetherBalance}
              rwdBalance={this.state.rwdTokenBalance}
              stakingBalance={this.state.stakingBalance}
              stakeTokens={this.stakeTokens}
              buyTether={this.buyTether}
              unstakeTokens={this.unstakeTokens}
              decentralBankContract={this.decentralBank}
              isOwner={this.state.isOwner}
              stakerArray={this.state.stakerArray}
              issueToken={this.issueToken}
            />
          ));
    }

    return (
      <div className="App" style={{ position: "relative" }}>
        <div style={{ position: "absolute" }}>
          <ParticleSettings />
        </div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "700px", minHeight: "100vm" }}
            >
              <div>{this.state.isOwner ? admin : content}</div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
