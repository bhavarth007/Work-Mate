import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'state/workmate_provider.dart';
import 'screens/home_screen.dart';
import 'screens/bookings_screen.dart';
import 'screens/wallet_screen.dart';
import 'screens/account_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => WorkMateProvider()..fetchAll()),
      ],
      child: const WorkMateApp(),
    ),
  );
}

class WorkMateApp extends StatelessWidget {
  const WorkMateApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'WorkMate - On-Demand Labour Platform',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF1A56DB),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1A56DB),
          primary: const Color(0xFF1A56DB),
        ),
        fontFamily: 'Inter',
        useMaterial3: true,
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatelessWidget {
  const MainNavigationScreen({super.key});

  static const List<Widget> _screens = [
    HomeScreen(),
    BookingsScreen(),
    WalletScreen(),
    AccountScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<WorkMateProvider>();
    final isHi = provider.isHindi;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.location_on, color: Colors.red, size: 14),
                const SizedBox(width: 4),
                Text(
                  isHi ? 'फ्लैट 402, सेक्टर 14, नोएडा' : 'Flat 402, Sector 14, Noida',
                  style: TextStyle(color: Colors.grey.shade600, fontSize: 11, fontWeight: FontWeight.w500),
                ),
                const Icon(Icons.arrow_drop_down, color: Colors.grey, size: 16),
              ],
            ),
            Text(
              isHi ? 'नमस्ते, रमेश!' : 'Hello, Ramesh!',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A)),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () => provider.toggleLanguage(),
            icon: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: const Color(0xFFBFDBFE)),
              ),
              child: Text(
                isHi ? 'EN' : 'हिन्दी',
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF1A56DB)),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: CircleAvatar(
              radius: 18,
              backgroundImage: const NetworkImage(
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              ),
            ),
          ),
        ],
      ),
      body: _screens[provider.currentNavIndex],
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(isHi ? 'त्वरित लेबर बुकिंग प्रारंभ की गई' : 'Instant Labour Booking flow opened')),
          );
        },
        backgroundColor: const Color(0xFF1A56DB),
        foregroundColor: Colors.white,
        icon: const Icon(Icons.bolt),
        label: Text(isHi ? 'तुरंत बुक करें' : 'Instant Book'),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: provider.currentNavIndex,
        onTap: (index) => provider.setNavIndex(index),
        selectedItemColor: const Color(0xFF1A56DB),
        unselectedItemColor: const Color(0xFF94A3B8),
        selectedFontSize: 11,
        unselectedFontSize: 11,
        type: BottomNavigationBarType.fixed,
        items: [
          BottomNavigationBarItem(
            icon: const Icon(Icons.home_outlined),
            activeIcon: const Icon(Icons.home),
            label: isHi ? 'होम' : 'Home',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.shopping_bag_outlined),
            activeIcon: const Icon(Icons.shopping_bag),
            label: isHi ? 'मेरी बुकिंग' : 'Orders',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.credit_card_outlined),
            activeIcon: const Icon(Icons.credit_card),
            label: isHi ? 'भुगतान' : 'Payments',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.person_outline),
            activeIcon: const Icon(Icons.person),
            label: isHi ? 'अकाउंट' : 'Account',
          ),
        ],
      ),
    );
  }
}
