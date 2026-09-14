import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/workmate_provider.dart';
import '../models/booking_model.dart';
import 'live_tracking_screen.dart';

class BookingsScreen extends StatefulWidget {
  const BookingsScreen({super.key});

  @override
  State<BookingsScreen> createState() => _BookingsScreenState();
}

class _BookingsScreenState extends State<BookingsScreen> {
  int _selectedTab = 0; // 0: Upcoming, 1: History

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<WorkMateProvider>();
    final isHi = provider.isHindi;

    final bookings = provider.bookings.where((b) {
      if (_selectedTab == 0) {
        return b.status == 'in_progress' || b.status == 'upcoming';
      } else {
        return b.status == 'completed' || b.status == 'cancelled';
      }
    }).toList();

    return Column(
      children: [
        // Tabs Header (Page 1 Mockup)
        Container(
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: const Color(0xFFE2E8F0),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _selectedTab = 0),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: _selectedTab == 0 ? Colors.white : Colors.transparent,
                      borderRadius: BorderRadius.circular(6),
                      boxShadow: _selectedTab == 0
                          ? [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4)]
                          : null,
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      isHi ? 'आगामी (Upcoming)' : 'Upcoming',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                        color: _selectedTab == 0 ? const Color(0xFF1A56DB) : Colors.grey.shade600,
                      ),
                    ),
                  ),
                ),
              ),
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _selectedTab = 1),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: _selectedTab == 1 ? Colors.white : Colors.transparent,
                      borderRadius: BorderRadius.circular(6),
                      boxShadow: _selectedTab == 1
                          ? [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4)]
                          : null,
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      isHi ? 'इतिहास (History)' : 'History',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                        color: _selectedTab == 1 ? const Color(0xFF1A56DB) : Colors.grey.shade600,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),

        // List
        Expanded(
          child: bookings.isEmpty
              ? Center(
                  child: Text(
                    isHi ? 'कोई रिकॉर्ड नहीं मिला' : 'No records found',
                    style: TextStyle(color: Colors.grey.shade500),
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: bookings.length,
                  itemBuilder: (context, index) {
                    final b = bookings[index];
                    return _buildBookingItem(context, b, isHi);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildBookingItem(BuildContext context, BookingModel b, bool isHi) {
    Color statusColor = Colors.orange;
    String statusText = b.status;
    if (b.status == 'in_progress') {
      statusColor = Colors.orange;
      statusText = isHi ? 'प्रगति पर' : 'In Progress';
    } else if (b.status == 'upcoming') {
      statusColor = const Color(0xFF1A56DB);
      statusText = isHi ? 'शेड्यूल' : 'Scheduled';
    } else if (b.status == 'completed') {
      statusColor = const Color(0xFF10B981);
      statusText = isHi ? 'पूर्ण' : 'Completed';
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                isHi ? b.serviceNameHi : b.serviceNameEn,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  statusText,
                  style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 10),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              CircleAvatar(
                radius: 16,
                backgroundImage: NetworkImage(
                  b.workerPhoto ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${b.workerName ?? "Worker"} • ★ ${b.workerRating}',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                  ),
                  Text(
                    b.scheduledDateTime,
                    style: TextStyle(color: Colors.grey.shade600, fontSize: 11),
                  ),
                ],
              ),
            ],
          ),
          const Divider(height: 18),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                isHi ? 'कुल लागत (Total Cost)' : 'Total Cost',
                style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
              ),
              Text(
                '₹${b.totalCost.toStringAsFixed(0)}',
                style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
              ),
            ],
          ),
          if (b.status != 'completed' && b.status != 'cancelled') ...[
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => LiveTrackingScreen(booking: b)),
                  );
                },
                icon: const Icon(Icons.navigation, size: 14),
                label: Text(
                  isHi ? 'सक्रिय GPS ट्रैकिंग देखें >' : 'Active GPS Tracking >',
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                ),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF1A56DB),
                  side: const BorderSide(color: Color(0xFF93C5FD)),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
