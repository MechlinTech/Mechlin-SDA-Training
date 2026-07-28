import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class ProfileAvatar extends StatelessWidget {
  const ProfileAvatar({super.key});

  static const String imageUrl =
      'https://i.pravatar.cc/300?img=12';

  @override
  Widget build(BuildContext context) {
    return CachedNetworkImage(
      imageUrl: imageUrl,
      imageBuilder: (context, imageProvider) => CircleAvatar(
        radius: 42,
        backgroundImage: imageProvider,
      ),
      placeholder: (context, url) => const CircleAvatar(
        radius: 42,
        child: CircularProgressIndicator(),
      ),
      errorWidget: (context, url, error) => const CircleAvatar(
        radius: 42,
        child: Icon(
          Icons.person,
          size: 40,
        ),
      ),
    );
  }
}