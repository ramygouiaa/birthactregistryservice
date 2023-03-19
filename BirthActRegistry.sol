pragma solidity ^0.8.0;

contract BirthActRegistry {

    address private owner;

    struct BirthAct {
        string uid;
        string cid;
    }

    mapping(string => BirthAct) private birthActs;
    string[] private birthActIds;

    event BirthActAdded(string uid, string cid);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the contract owner can add a birth act.");
        _;
    }

    function addBirthAct(BirthAct memory birthAct) public onlyOwner {
        require(bytes(birthActs[birthAct.uid].uid).length == 0, "Birth act already exists.");
        birthActs[birthAct.uid] = birthAct;
        birthActIds.push(birthAct.uid);
        emit BirthActAdded(birthAct.uid, birthAct.cid);
    }

    function getBirthActById(string memory _uid) public view returns (string memory) {
        return birthActs[_uid].cid;
    }

    function getAllBirthActs() public view returns (string[] memory) {
        return birthActIds;
    }

}
