import React, { Component } from "react";
import tether from "../tether.png";
import Airdrop from "./Airdrop";
import "./Admin.css";
class Admin extends Component {
  render() {
    return (
      <>
        <h3 className="heading">Admin Dashboard</h3>
        <div id="content" className="mt-3">
          <div className="card mb-2 row mainContent" style={{ opacity: ".9" }}>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                let amount;
                amount = this.input.value.toString();
                amount = window.web3.utils.toWei(amount, "Ether");
                this.props.stakeTokens(amount);
              }}
              className="col-12 formMain"
            >
              <div
                style={{ borderSpacing: "0 1em" }}
                className="balanceWrapper"
              >
                {/* <span className="float-left" style={{ marginLeft: "15px" }}>
                <b>Stake Tokens</b>
              </span> */}
                <span className="float-right" style={{ marginRight: "8px" }}>
                  Balance:{" "}
                  {window.web3.utils.fromWei(this.props.tetherBalance, "Ether")}
                </span>
              </div>
            </form>

            <div className="listHeading">LIST STAKER</div>
            <table className="table text-muted text-center">
              <thead>
                <tr style={{ color: "black" }}>
                  <th scope="col">Staker</th>
                  <th scope="col">Staking Balance</th>
                </tr>
              </thead>
              <tbody>
                {this.props.stakerArray ? (
                  this.props.stakerArray.map((staker) => {
                    return (
                      <tr style={{ color: "black" }}>
                        <td>{staker.address}</td>
                        <td>
                          {staker.amount}
                          &nbsp;USDT
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <></>
                )}
              </tbody>
            </table>

            <button
              type="submit"
              onClick={(event) => {
                event.preventDefault(this.props.issueToken());
              }}
              className="btn btn-primary btn-lg btn-block col-6 button"
            >
              ISSUE TOKENS
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

export default Admin;
