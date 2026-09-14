import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/workmate_provider.dart';

class AccountScreen extends StatelessWidget {
  const AccountScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<WorkMateProvider>();
    final isHi = provider.isHindi;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Profile Card (Page 1 Mockup)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 30,
                  backgroundImage: NetworkImage(
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                  ),
                ),
                const SizedBox(width: 14),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      isHi ? 'रमेश (Ramesh Kumar)' : 'Ramesh Kumar',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    const SizedBox(height: 2),
                    const Text('+91 98765 43210', style: TextStyle(color: Colors.grey, fontSize: 12)),
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFECFDF5),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFF10B981)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 12),
                          const SizedBox(width: 4),
                          Text(
                            isHi ? 'सत्यापित प्रोफाइल' : 'Verified Profile',
                            style: const TextStyle(color: Color(0xFF059669), fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Menu Items (Page 1 Mockup)
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                _menuItem(
                  icon: Icons.language,
                  title: isHi ? 'भाषा (Language)' : 'Language',
                  trailingText: isHi ? 'हिंदी/English >' : 'English/हिंदी >',
                  onTap: () => provider.toggleLanguage(),
                ),
                const Divider(height: 1),
                _menuItem(
                  icon: Icons.security,
                  title: isHi ? 'सुरक्षा (Security)' : 'Security & Privacy',
                  onTap: () {},
                ),
                const Divider(height: 1),
                _menuItem(
                  icon: Icons.health_and_safety,
                  title: isHi ? 'माइक्रो-इंश्योरेंस (Micro-Insurance)' : 'Micro-Insurance Enrollment',
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Accident & Health Insurance: ₹2,00,000 cover active.')),
                    );
                  },
                ),
                const Divider(height: 1),
                _menuItem(
                  icon: Icons.support_agent,
                  title: isHi ? '24/7 सहायता (कॉल / चैट सपोर्ट)' : '24/7 Support (Call / Chat)',
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Support Hotline: 1800-123-WORK (Toll Free)')),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _menuItem({
    required IconData icon,
    required String title,
    String? trailingText,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFF1A56DB), size: 20),
      title: Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
      trailing: trailingText != null
          ? Text(trailingText, style: const TextStyle(color: Color(0xFF1A56DB), fontWeight: FontWeight.bold, fontSize: 12))
          : const Icon(Icons.chevron_right, size: 18, color: Colors.grey),
      onTap: onTap,
    );
  }
}
