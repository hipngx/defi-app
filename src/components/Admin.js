import React, { Component } from "react";
import tether from "../tether.png";
import Airdrop from "./Airdrop";

class Admin extends Component {
  render() {
    return (
      <div id="content" className="mt-3">
        <div className="card mb-2" style={{ opacity: ".9" }}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              let amount;
              amount = this.input.value.toString();
              amount = window.web3.utils.toWei(amount, "Ether");
              this.props.stakeTokens(amount);
            }}
            className="mb-3"
          >
            <div style={{ borderSpacing: "0 1em" }}>
              <label className="float-left" style={{ marginLeft: "15px" }}>
                <b>Stake Tokens</b>
              </label>
              <span className="float-right" style={{ marginRight: "8px" }}>
                Balance:{" "}
                {window.web3.utils.fromWei(this.props.tetherBalance, "Ether")}
              </span>
            </div>
          </form>

          <button
            type="submit"
            onClick={(event) => {
              event.preventDefault(this.props.issueToken());
            }}
            className="btn btn-primary btn-lg btn-block"
          >
            Issue Tokens
          </button>
          <ul>
            {this.props.stakerArray ? (
              this.props.stakerArray.map((staker) => {
                console.log("staker", staker);
                return (
                  <li>
                    {staker.address} - {staker.amount}
                  </li>
                );
              })
            ) : (
              <></>
            )}
          </ul>
          <div className="card-body text-center" style={{ color: "blue" }}>
            AIRDROP{" "}
            <Airdrop
              stakingBalance={this.props.stakingBalance}
              decentralBankContract={this.props.decentralBankContract}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
