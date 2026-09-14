class BookingModel {
  final String id;
  final String bookingNumber;
  final String customerName;
  final String customerPhone;
  final String? workerId;
  final String? workerName;
  final String? workerPhoto;
  final double workerRating;
  final String? workerTrade;
  final String? workerTradeHi;
  final String serviceId;
  final String serviceNameEn;
  final String serviceNameHi;
  final String taskDescription;
  final String bookingType;
  final String scheduledDateTime;
  final int durationHours;
  final double totalCost;
  final double commissionAmount;
  final double workerPayoutAmount;
  final String otp;
  final int etaMinutes;
  final String status;
  final String locationAddress;
  final double lat;
  final double lng;
  final bool isRated;

  BookingModel({
    required this.id,
    required this.bookingNumber,
    required this.customerName,
    required this.customerPhone,
    this.workerId,
    this.workerName,
    this.workerPhoto,
    this.workerRating = 4.8,
    this.workerTrade,
    this.workerTradeHi,
    required this.serviceId,
    required this.serviceNameEn,
    required this.serviceNameHi,
    required this.taskDescription,
    required this.bookingType,
    required this.scheduledDateTime,
    required this.durationHours,
    required this.totalCost,
    required this.commissionAmount,
    required this.workerPayoutAmount,
    required this.otp,
    required this.etaMinutes,
    required this.status,
    required this.locationAddress,
    required this.lat,
    required this.lng,
    this.isRated = false,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'] ?? '',
      bookingNumber: json['booking_number'] ?? '',
      customerName: json['customer_name'] ?? '',
      customerPhone: json['customer_phone'] ?? '',
      workerId: json['worker_id'],
      workerName: json['worker_name'],
      workerPhoto: json['worker_photo'],
      workerRating: (json['worker_rating'] as num?)?.toDouble() ?? 4.8,
      workerTrade: json['worker_trade'],
      workerTradeHi: json['worker_trade_hi'],
      serviceId: json['service_id'] ?? '',
      serviceNameEn: json['service_name_en'] ?? '',
      serviceNameHi: json['service_name_hi'] ?? '',
      taskDescription: json['task_description'] ?? '',
      bookingType: json['booking_type'] ?? 'instant',
      scheduledDateTime: json['scheduled_date_time'] ?? '',
      durationHours: json['duration_hours'] ?? 4,
      totalCost: (json['total_cost'] as num?)?.toDouble() ?? 0.0,
      commissionAmount: (json['commission_amount'] as num?)?.toDouble() ?? 0.0,
      workerPayoutAmount: (json['worker_payout_amount'] as num?)?.toDouble() ?? 0.0,
      otp: json['otp'] ?? '4567',
      etaMinutes: json['eta_minutes'] ?? 15,
      status: json['status'] ?? 'upcoming',
      locationAddress: json['location_address'] ?? '',
      lat: (json['lat'] as num?)?.toDouble() ?? 28.6139,
      lng: (json['lng'] as num?)?.toDouble() ?? 77.2090,
      isRated: json['is_rated'] == 1 || json['is_rated'] == true,
    );
  }
}
