import 'package:flutter/material.dart';
import '../models/service_model.dart';
import '../models/booking_model.dart';
import '../models/wallet_model.dart';
import '../services/api_service.dart';

class WorkMateProvider extends ChangeNotifier {
  bool _isHindi = true;
  int _currentNavIndex = 0;
  List<CategoryModel> _categories = [];
  List<BookingModel> _bookings = [];
  WalletModel _wallet = WalletModel(balance: 13000.0);
  List<TransactionModel> _transactions = [];
  bool _isLoading = false;

  bool get isHindi => _isHindi;
  int get currentNavIndex => _currentNavIndex;
  List<CategoryModel> get categories => _categories;
  List<BookingModel> get bookings => _bookings;
  WalletModel get wallet => _wallet;
  List<TransactionModel> get transactions => _transactions;
  bool get isLoading => _isLoading;

  BookingModel? get activeBooking {
    try {
      return _bookings.firstWhere((b) => b.status == 'in_progress');
    } catch (_) {
      return _bookings.isNotEmpty ? _bookings.first : null;
    }
  }

  void toggleLanguage() {
    _isHindi = !_isHindi;
    notifyListeners();
  }

  void setNavIndex(int index) {
    _currentNavIndex = index;
    notifyListeners();
  }

  Future<void> fetchAll() async {
    _isLoading = true;
    notifyListeners();

    try {
      final results = await Future.wait([
        ApiService.getCategories(),
        ApiService.getBookings(),
        ApiService.getWallet(),
        ApiService.getTransactions(),
      ]);

      _categories = results[0] as List<CategoryModel>;
      _bookings = results[1] as List<BookingModel>;
      _wallet = results[2] as WalletModel;
      _transactions = results[3] as List<TransactionModel>;
    } catch (e) {
      debugPrint('Error fetching WorkMate data: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createBooking(Map<String, dynamic> data) async {
    final newBooking = await ApiService.createBooking(data);
    if (newBooking != null) {
      _bookings.insert(0, newBooking);
      await fetchAll();
      return true;
    }
    return false;
  }
}
