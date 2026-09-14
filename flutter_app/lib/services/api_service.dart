import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/service_model.dart';
import '../models/worker_model.dart';
import '../models/booking_model.dart';
import '../models/wallet_model.dart';

class ApiService {
  static const String baseUrl = 'http://127.0.0.1:8000/api';

  static Future<List<CategoryModel>> getCategories() async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/categories'));
      if (res.statusCode == 200) {
        final List list = json.decode(res.body);
        return list.map((e) => CategoryModel.fromJson(e)).toList();
      }
    } catch (_) {}
    return [
      CategoryModel(id: 'construction', nameEn: 'Construction', nameHi: 'राजमिस्त्री', subtextEn: 'Masonry & Renovation', subtextHi: 'निर्माण एवं मरम्मत कार्य', icon: 'hammer'),
      CategoryModel(id: 'events', nameEn: 'Events', nameHi: 'कैटरिंग स्टाफ', subtextEn: 'Catering & Kitchen', subtextHi: 'कार्यक्रम एवं कैटरिंग सेवाएं', icon: 'utensils'),
      CategoryModel(id: 'shifting', nameEn: 'House Shifting', nameHi: 'सामान उठाना', subtextEn: 'Packing & Loading', subtextHi: 'घर का सामान व सामान्य मजदूरी', icon: 'truck'),
      CategoryModel(id: 'textile', nameEn: 'Textile Helper', nameHi: 'टेक्सटाइल हेल्पर', subtextEn: 'Mill Helper & Fabric', subtextHi: 'कपड़ा उद्योग एवं मिल हेल्पर', icon: 'scissors'),
    ];
  }

  static Future<List<ServiceModel>> getServices({String? categoryId}) async {
    try {
      String url = '$baseUrl/services';
      if (categoryId != null) url += '?category_id=$categoryId';
      final res = await http.get(Uri.parse(url));
      if (res.statusCode == 200) {
        final List list = json.decode(res.body);
        return list.map((e) => ServiceModel.fromJson(e)).toList();
      }
    } catch (_) {}
    return [];
  }

  static Future<List<BookingModel>> getBookings() async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/bookings'));
      if (res.statusCode == 200) {
        final List list = json.decode(res.body);
        return list.map((e) => BookingModel.fromJson(e)).toList();
      }
    } catch (_) {}
    return [];
  }

  static Future<BookingModel?> createBooking(Map<String, dynamic> data) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/bookings'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data),
      );
      if (res.statusCode == 201) {
        final map = json.decode(res.body);
        return BookingModel.fromJson(map['booking']);
      }
    } catch (_) {}
    return null;
  }

  static Future<WalletModel> getWallet() async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/wallet'));
      if (res.statusCode == 200) {
        return WalletModel.fromJson(json.decode(res.body));
      }
    } catch (_) {}
    return WalletModel(balance: 13000.0);
  }

  static Future<List<TransactionModel>> getTransactions() async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/wallet/transactions'));
      if (res.statusCode == 200) {
        final List list = json.decode(res.body);
        return list.map((e) => TransactionModel.fromJson(e)).toList();
      }
    } catch (_) {}
    return [];
  }

  static Future<bool> verifyOtp(String bookingId, String otp) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/bookings/$bookingId/verify-otp'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'booking_id': bookingId, 'otp': otp}),
      );
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  static Future<bool> completeJob(String bookingId) async {
    try {
      final res = await http.post(Uri.parse('$baseUrl/bookings/$bookingId/complete'));
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}
