class CategoryModel {
  final String id;
  final String nameEn;
  final String nameHi;
  final String subtextEn;
  final String subtextHi;
  final String icon;
  final double rating;
  final int servicesCount;

  CategoryModel({
    required this.id,
    required this.nameEn,
    required this.nameHi,
    required this.subtextEn,
    required this.subtextHi,
    required this.icon,
    this.rating = 4.8,
    this.servicesCount = 4,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['id'] ?? '',
      nameEn: json['name_en'] ?? '',
      nameHi: json['name_hi'] ?? '',
      subtextEn: json['subtext_en'] ?? '',
      subtextHi: json['subtext_hi'] ?? '',
      icon: json['icon'] ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 4.8,
      servicesCount: json['services_count'] ?? 4,
    );
  }
}

class ServiceModel {
  final String id;
  final String categoryId;
  final String nameEn;
  final String nameHi;
  final String descEn;
  final String descHi;
  final double baseRate;
  final String unit;
  final bool popular;

  ServiceModel({
    required this.id,
    required this.categoryId,
    required this.nameEn,
    required this.nameHi,
    required this.descEn,
    required this.descHi,
    required this.baseRate,
    required this.unit,
    this.popular = false,
  });

  factory ServiceModel.fromJson(Map<String, dynamic> json) {
    return ServiceModel(
      id: json['id'] ?? '',
      categoryId: json['category_id'] ?? '',
      nameEn: json['name_en'] ?? '',
      nameHi: json['name_hi'] ?? '',
      descEn: json['desc_en'] ?? '',
      descHi: json['desc_hi'] ?? '',
      baseRate: (json['base_rate'] as num?)?.toDouble() ?? 600.0,
      unit: json['unit'] ?? 'per_day',
      popular: json['popular'] == 1 || json['popular'] == true,
    );
  }
}
