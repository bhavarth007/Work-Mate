class WorkerModel {
  final String id;
  final String name;
  final String phone;
  final String photo;
  final String primaryTrade;
  final String primaryTradeHi;
  final String categoryId;
  final double rating;
  final int reviewsCount;
  final double hourlyRate;
  final double dailyRate;
  final bool aadhaarVerified;
  final bool policeVerified;
  final String kycStatus;
  final int experienceYears;
  final bool isAvailable;

  WorkerModel({
    required this.id,
    required this.name,
    required this.phone,
    required this.photo,
    required this.primaryTrade,
    required this.primaryTradeHi,
    required this.categoryId,
    this.rating = 4.8,
    this.reviewsCount = 120,
    required this.hourlyRate,
    required this.dailyRate,
    this.aadhaarVerified = true,
    this.policeVerified = true,
    this.kycStatus = 'verified',
    this.experienceYears = 3,
    this.isAvailable = true,
  });

  factory WorkerModel.fromJson(Map<String, dynamic> json) {
    return WorkerModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      phone: json['phone'] ?? '',
      photo: json['photo'] ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      primaryTrade: json['primary_trade'] ?? '',
      primaryTradeHi: json['primary_trade_hi'] ?? '',
      categoryId: json['category_id'] ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 4.8,
      reviewsCount: json['reviews_count'] ?? 0,
      hourlyRate: (json['hourly_rate'] as num?)?.toDouble() ?? 100.0,
      dailyRate: (json['daily_rate'] as num?)?.toDouble() ?? 750.0,
      aadhaarVerified: json['aadhaar_verified'] == 1 || json['aadhaar_verified'] == true,
      policeVerified: json['police_verified'] == 1 || json['police_verified'] == true,
      kycStatus: json['kyc_status'] ?? 'verified',
      experienceYears: json['experience_years'] ?? 3,
      isAvailable: json['is_available'] == 1 || json['is_available'] == true,
    );
  }
}
