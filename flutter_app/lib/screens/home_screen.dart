import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/workmate_provider.dart';
import '../models/service_model.dart';
import '../models/booking_model.dart';
import 'live_tracking_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<WorkMateProvider>();
    final isHi = provider.isHindi;

    return RefreshIndicator(
      onRefresh: () => provider.fetchAll(),
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search Bar (Page 1 Mockup)
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(30),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  const Icon(Icons.search, color: Colors.grey, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: isHi
                            ? 'किसे ढूंढ रहे हैं? राजमिस्त्री...'
                            : 'Looking for? Mason, Plumber...',
                        border: InputBorder.none,
                        hintStyle: const TextStyle(fontSize: 13, color: Colors.grey),
                      ),
                    ),
                  ),
                  CircleAvatar(
                    radius: 16,
                    backgroundColor: const Color(0xFFEBF5FF),
                    child: const Icon(Icons.mic, color: Color(0xFF1A56DB), size: 18),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // 4 Main Service Categories (Page 1 Mockup)
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1.3,
              ),
              itemCount: provider.categories.length,
              itemBuilder: (context, index) {
                final cat = provider.categories[index];
                return _buildCategoryCard(context, cat, isHi);
              },
            ),
            const SizedBox(height: 20),

            // Active Booking Card (Page 1 Mockup)
            Text(
              isHi ? 'सक्रिय बुकिंग (Active Booking)' : 'Active Booking',
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            if (provider.activeBooking != null)
              _buildActiveBookingCard(context, provider.activeBooking!, isHi)
            else
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    isHi ? 'कोई सक्रिय बुकिंग नहीं है' : 'No active bookings currently.',
                    style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                  ),
                ),
              ),
            const SizedBox(height: 20),

            // Trust Banner (Page 1 Mockup)
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.verified_user, color: Color(0xFF16A34A), size: 18),
                      const SizedBox(width: 8),
                      Text(
                        isHi ? '100% सत्यापन | सुरक्षित भुगतान' : '100% Verification | Secure Escrow',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        isHi ? 'भरोसेमंद साथी: UPI, Razorpay, UIDAI' : 'Partners: UPI, Razorpay, UIDAI',
                        style: TextStyle(color: Colors.grey.shade600, fontSize: 11),
                      ),
                      Row(
                        children: [
                          _chip('UPI'),
                          const SizedBox(width: 6),
                          _chip('Razorpay'),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _chip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildCategoryCard(BuildContext context, CategoryModel cat, bool isHi) {
    IconData iconData = Icons.construction;
    Color iconBg = const Color(0xFFEFF6FF);
    Color iconColor = const Color(0xFF2563EB);

    if (cat.id == 'events') {
      iconData = Icons.restaurant;
      iconBg = const Color(0xFFFDF2F8);
      iconColor = const Color(0xFFDB2777);
    } else if (cat.id == 'shifting') {
      iconData = Icons.local_shipping;
      iconBg = const Color(0xFFFEFCE8);
      iconColor = const Color(0xFFCA8A04);
    } else if (cat.id == 'textile') {
      iconData = Icons.content_cut;
      iconBg = const Color(0xFFF0FDF4);
      iconColor = const Color(0xFF16A34A);
    }

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(12),
      child: Stack(
        children: [
          Positioned(
            top: 0,
            right: 0,
            child: Row(
              children: [
                const Icon(Icons.star, color: Color(0xFFF59E0B), size: 12),
                const SizedBox(width: 2),
                Text(
                  cat.rating.toStringAsFixed(1),
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircleAvatar(
                radius: 18,
                backgroundColor: iconBg,
                child: Icon(iconData, color: iconColor, size: 18),
              ),
              const SizedBox(height: 8),
              Text(
                isHi ? cat.nameHi : cat.nameEn,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              ),
              Text(
                isHi ? cat.nameEn : cat.subtextHi,
                style: TextStyle(color: Colors.grey.shade600, fontSize: 11),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActiveBookingCard(BuildContext context, BookingModel b, bool isHi) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1E3A8A), Color(0xFF1E40AF)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E40AF).withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 22,
                backgroundImage: NetworkImage(
                  b.workerPhoto ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          b.workerName ?? 'Verified Worker',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                          decoration: BoxDecoration(
                            color: Colors.green.withOpacity(0.2),
                            border: Border.all(color: Colors.greenAccent),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            isHi ? 'सत्यापित' : 'Verified',
                            style: const TextStyle(color: Colors.greenAccent, fontSize: 9),
                          ),
                        ),
                      ],
                    ),
                    Text(
                      '${b.workerTrade ?? 'Worker'} • ★ ${b.workerRating}',
                      style: const TextStyle(color: Color(0xFFBFDBFE), fontSize: 11),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.two_wheeler, color: Color(0xFFFEF08A), size: 16),
                    const SizedBox(width: 6),
                    Text(
                      'ETA: ${b.etaMinutes} ${isHi ? "मिनट" : "mins"}',
                      style: const TextStyle(
                        color: Color(0xFFFEF08A),
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    const Text('OTP: ', style: TextStyle(color: Colors.white70, fontSize: 11)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        b.otp,
                        style: const TextStyle(
                          color: Color(0xFF1E3A8A),
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => LiveTrackingScreen(booking: b)),
                    );
                  },
                  icon: const Icon(Icons.location_searching, size: 14),
                  label: Text(isHi ? 'लाइव ट्रैकिंग' : 'Live GPS Tracking', style: const TextStyle(fontSize: 12)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
