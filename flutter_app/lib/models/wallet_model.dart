class WalletModel {
  final double balance;
  final String currency;
  final String symbol;
  final String upiVerified;
  final String cardVerified;
  final bool razorpayConnected;

  WalletModel({
    required this.balance,
    this.currency = 'INR',
    this.symbol = '₹',
    this.upiVerified = 'ramesh@okhdfcbank',
    this.cardVerified = 'HDFC Platinum Debit (•••• 4092)',
    this.razorpayConnected = true,
  });

  factory WalletModel.fromJson(Map<String, dynamic> json) {
    return WalletModel(
      balance: (json['balance'] as num?)?.toDouble() ?? 13000.0,
      currency: json['currency'] ?? 'INR',
      symbol: json['symbol'] ?? '₹',
      upiVerified: json['upi_verified'] ?? 'ramesh@okhdfcbank',
      cardVerified: json['card_verified'] ?? 'HDFC Platinum Debit (•••• 4092)',
      razorpayConnected: json['razorpay_connected'] == 1 || json['razorpay_connected'] == true,
    );
  }
}

class TransactionModel {
  final String id;
  final String type;
  final double amount;
  final String direction;
  final String titleEn;
  final String titleHi;
  final String status;
  final String dateStr;
  final String method;
  final String referenceId;

  TransactionModel({
    required this.id,
    required this.type,
    required this.amount,
    required this.direction,
    required this.titleEn,
    required this.titleHi,
    required this.status,
    required this.dateStr,
    required this.method,
    required this.referenceId,
  });

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      id: json['id'] ?? '',
      type: json['type'] ?? 'payment',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      direction: json['direction'] ?? 'debit',
      titleEn: json['title_en'] ?? '',
      titleHi: json['title_hi'] ?? '',
      status: json['status'] ?? 'success',
      dateStr: json['date_str'] ?? '',
      method: json['method'] ?? '',
      referenceId: json['reference_id'] ?? '',
    );
  }
}
