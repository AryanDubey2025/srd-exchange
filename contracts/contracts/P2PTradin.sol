// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract P2PTrading {
    address public admin;
    IERC20 public usdtToken;
    
    struct Order {
        uint256 orderId;
        address user;
        uint256 amount;
        bool isBuyOrder;
        bool isCompleted;
        bool isApproved;
        uint256 timestamp;
    }
    
    mapping(uint256 => Order) public orders;
    mapping(address => bool) public authorizedAdmins;
    uint256 public orderCounter;
    
    event OrderCreated(uint256 orderId, address user, uint256 amount, bool isBuyOrder);
    event OrderApproved(uint256 orderId);
    event OrderCompleted(uint256 orderId);
    
    modifier onlyAdmin() {
        require(authorizedAdmins[msg.sender], "Not authorized admin");
        _;
    }
    
    constructor(address _usdtToken) {
        admin = msg.sender;
        usdtToken = IERC20(_usdtToken);
        authorizedAdmins[msg.sender] = true;
    }
    
    function createBuyOrder(uint256 _amount) external {
        require(_amount >= 1e6 && _amount <= 50e6, "Amount must be between $1-$50 USDT");
        
        orderCounter++;
        orders[orderCounter] = Order({
            orderId: orderCounter,
            user: msg.sender,
            amount: _amount,
            isBuyOrder: true,
            isCompleted: false,
            isApproved: false,
            timestamp: block.timestamp
        });
        
        emit OrderCreated(orderCounter, msg.sender, _amount, true);
    }
    
    function createSellOrder(uint256 _amount) external {
        require(usdtToken.balanceOf(msg.sender) >= _amount, "Insufficient USDT");
        require(usdtToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        orderCounter++;
        orders[orderCounter] = Order({
            orderId: orderCounter,
            user: msg.sender,
            amount: _amount,
            isBuyOrder: false,
            isCompleted: false,
            isApproved: false,
            timestamp: block.timestamp
        });
        
        emit OrderCreated(orderCounter, msg.sender, _amount, false);
    }
    
    function approveOrder(uint256 _orderId) external onlyAdmin {
        orders[_orderId].isApproved = true;
        emit OrderApproved(_orderId);
    }
    
    function completeOrder(uint256 _orderId) external onlyAdmin {
        Order storage order = orders[_orderId];
        require(order.isApproved, "Order not approved");
        require(!order.isCompleted, "Order already completed");
        
        if (order.isBuyOrder) {
            require(usdtToken.transfer(order.user, order.amount), "Transfer failed");
        } else {
            require(usdtToken.transfer(admin, order.amount), "Transfer failed");
        }
        
        order.isCompleted = true;
        emit OrderCompleted(_orderId);
    }
    
    function addAdmin(address _admin) external onlyAdmin {
        authorizedAdmins[_admin] = true;
    }
    
    function getOrder(uint256 _orderId) external view returns (Order memory) {
        return orders[_orderId];
    }
}
