pragma solidity ^0.8.0;

contract BirthRegistry {
    struct Child {
        string name;
        string surname;
        string sex;
        string birthday;
        string placeOfBirth;
        string religion;
    }

    struct Parent {
        string familyName;
        string birthName;
        string surname;
        string religion;
    }

    struct BirthAct {
        string registryOffice;
        string registrationNumber;
        Child child;
        Parent mother;
        Parent father;
        string furtherInformation;
    }

    mapping(bytes32 => BirthAct) private birthActs;
    bytes32[] private hashList;
    address private owner;

    event BirthActAdded(string childName, string childSurname, string childBirthday);
    event OwnerOfContract(address contractOwner);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the contract owner can add a birth act.");
        _;
    }

    function addBirthAct(BirthAct memory birthAct) public onlyOwner {
        bytes32 childHash = sha256(abi.encodePacked(birthAct.child.name, birthAct.child.surname, birthAct.child.birthday));
        require(bytes(birthActs[childHash].child.birthday).length == 0, "Birth act already exists");
        birthActs[childHash] = birthAct;
        hashList.push(childHash);

        emit BirthActAdded(birthAct.child.name, birthAct.child.surname, birthAct.child.birthday);
        emit OwnerOfContract(owner);
    }

    function getBirthAct(bytes32 birthActHash) public view returns (BirthAct memory) {
        return birthActs[birthActHash];
    }

    function getAllBirthActHashes() public view returns (bytes32[] memory) {
        return hashList;
    }
}
//example of a call to addBirthAct() function
//["Berlin registry office","QR45W6E", ["messi", "Lionel", "male","15-12-1991","Argentina","jewish"],["motherFamilyname","motherBirthname","mothersurname","motherreligion"],["fatherFamilyname","fatherBirthname","fatherrsurname","fatherreligion"],"furtherinformation..."]