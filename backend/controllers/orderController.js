import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import moment from 'moment';
import qs from 'qs';
import crypto from 'crypto';

// Hàm hỗ trợ sắp xếp chuỗi dữ liệu theo đúng chuẩn VNPay yêu cầu
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: false // Trạng thái mặc định là chưa thanh toán
        });
        
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        if (req.body.paymentMethod === "COD") {
            // Nếu khách chọn COD, trả về báo thành công luôn
            res.json({ success: true, message: "Order Placed Successfully" });
        } else if (req.body.paymentMethod === "VNPAY") {
            // Nếu khách chọn VNPay, tiến hành tạo URL thanh toán
            let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "127.0.0.1";
            let tmnCode = process.env.VNP_TMNCODE;
            let secretKey = process.env.VNP_HASHSECRET;
            let vnpUrl = process.env.VNP_URL;
            let returnUrl = process.env.VNP_RETURNURL;

            let createDate = moment(new Date()).format('YYYYMMDDHHmmss');
            let orderId = newOrder._id.toString();
            let amount = req.body.amount * 25000; // Đổi sang VNĐ 

            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Locale'] = 'vn';
            vnp_Params['vnp_CurrCode'] = 'VND';
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + orderId;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = amount * 100; // Theo chuẩn VNPay phải nhân 100
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;

            vnp_Params = sortObject(vnp_Params);

            // Tạo mã băm bảo mật (Secure Hash)
            let signData = qs.stringify(vnp_Params, { encode: false });
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

            // Trả link VNPay về cho Frontend
            res.json({ success: true, session_url: vnpUrl });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error Placing Order" });
    }
}

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Hàm xác nhận thanh toán VNPay
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success) {
            // Cập nhật trạng thái payment thành true (Đã thanh toán)
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            // Nếu thất bại thì xóa đơn hàng nháp đó đi
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { placeOrder, userOrders, listOrders, updateStatus, verifyOrder }