import { constants } from "buffer";
import React, { Component } from "react";
import tether from "../tether.png";
import Airdrop from "./Airdrop";
import "./Main.css";
class Main extends Component {
  render() {
    return (
      <>
        <h3 className="heading">Welcome to DecentralBank</h3>
        <div id="content" className="mt-3">
          <table className="table text-muted text-center">
            <thead>
              <tr style={{ color: "white" }}>
                <th scope="col">Staking Balance</th>
                <th scope="col">Reward Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ color: "white" }}>
                <td>
                  {window.web3.utils.fromWei(
                    this.props.stakingBalance,
                    "Ether"
                  )}{" "}
                  USDT
                </td>
                <td>
                  {window.web3.utils.fromWei(this.props.rwdBalance, "Ether")}{" "}
                  RWD
                </td>
              </tr>
            </tbody>
          </table>
          <div className="card mb-2 row mainContent" style={{ opacity: ".9" }}>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                let amount;
                amount = this.input.value.toString();
                amount = window.web3.utils.toWei(amount, "Ether");
                this.props.stakeTokens(amount);
              }}
              className="mb-3 formMain"
            >
              <div
                style={{ borderSpacing: "0 1em" }}
                // className="balanceWrapper"
              >
                <label className="float-left" style={{ marginLeft: "15px" }}>
                  <b>Stake Tokens</b>
                </label>
                <span className="float-right" style={{ marginRight: "8px" }}>
                  Balance:{" "}
                  {window.web3.utils.fromWei(this.props.tetherBalance, "Ether")}
                </span>
                <div className="input-group mb-4">
                  <>
                    <input
                      ref={(input) => {
                        this.input = input;
                      }}
                      type="text"
                      placeholder="0"
                      required
                    />
                    <div className="input-group-open">
                      <div className="input-group-text">
                        <img src={tether} alt="tether" height="32" />
                        &nbsp;&nbsp;&nbsp; USDT
                      </div>
                    </div>
                  </>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg btn-block mt-4 button m-a col-8"
                  >
                    Staking Balance
                  </button>
                </div>
              </div>
            </form>

            <button
              type="submit"
              onClick={(event) => {
                event.preventDefault(this.props.unstakeTokens());
              }}
              className="btn btn-primary btn-lg btn-block button col-8"
            >
              WITHDRAW
            </button>

            <div className="card-body text-center" style={{ color: "blue" }}>
              AIRDROP{" "}
              <Airdrop
                stakingBalance={this.props.stakingBalance}
                decentralBankContract={this.props.decentralBankContract}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Main;
