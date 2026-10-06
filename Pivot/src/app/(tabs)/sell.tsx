import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, BrandMark, Pill, palette } from '@/components/pivot-ui';
import { useShop, type UserListing } from '@/state/shop-store';

const categories = ['Tops', 'Dresses', 'Outerwear', 'Knitwear', 'Bottoms', 'Accessories'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'One size'];
const conditions = ['New with tags', 'Like new', 'Excellent', 'Very good', 'Good'];

export default function SellScreen() {
  const { addListing } = useShop();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Tops');
  const [size, setSize] = useState('M');
  const [condition, setCondition] = useState('Excellent');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [published, setPublished] = useState(false);

  const appendPhotos = (uris: string[]) => {
    setPhotos((current) => [...current, ...uris].slice(0, 5));
    setError('');
    setPublished(false);
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setError('Camera access is needed to take a listing photo. You can also choose photos from your library.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled) appendPhotos(result.assets.map((asset) => asset.uri));
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : 'Unknown camera error';
      setError(`Could not open the camera: ${detail}`);
    }
  };

  const choosePhotos = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError('Photo library access is needed to add listing photos. You can take a photo with the camera instead.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: Math.max(1, 5 - photos.length),
        quality: 0.8,
      });
      if (!result.canceled) appendPhotos(result.assets.map((asset) => asset.uri));
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : 'Unknown photo library error';
      setError(`Could not open your photo library: ${detail}`);
    }
  };

  const publishListing = () => {
    const parsedPrice = Number(price);
    if (!title.trim() || !description.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0 || !color.trim() || !material.trim() || photos.length === 0) {
      setError('Add a title, description, valid price, color, material, and at least one photo before publishing.');
      setPublished(false);
      return;
    }
    const listing: UserListing = {
      id: `listing-${Date.now()}`,
      name: title.trim(),
      description: description.trim(),
      brand: brand.trim() || 'Independent',
      price: parsedPrice,
      ...(originalPrice.trim() && Number(originalPrice) > 0
        ? { originalPrice: Number(originalPrice) }
        : {}),
      condition,
      category,
      styleTags: [],
      colors: [color.trim()],
      sizes: [size],
      material: material.trim(),
      photos,
      image: photos[0],
      seller: 'You',
      listingStatus: 'open',
      createdAt: new Date().toISOString(),
    };
    addListing(listing);
    setTitle('');
    setDescription('');
    setBrand('');
    setPrice('');
    setOriginalPrice('');
    setCategory('Tops');
    setSize('M');
    setCondition('Excellent');
    setColor('');
    setMaterial('');
    setPhotos([]);
    setError('');
    setPublished(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>GIVE YOUR PIECE A NEW CHAPTER</Text>
            <BrandMark />
          </View>
          <Text style={styles.headerIcon}>＋</Text>
        </View>
        <Text style={styles.title}>List a piece</Text>
        <Text style={styles.subtitle}>A few thoughtful details help the right person find it.</Text>

        <View style={styles.photoCard}>
          <Text style={styles.sectionTitle}>Photos <Text style={styles.required}>*</Text></Text>
          <Text style={styles.help}>Add up to five clear photos of your item.</Text>
          <View style={styles.photoActions}>
            <Pressable accessibilityRole="button" onPress={takePhoto} style={styles.photoButton}>
              <Text style={styles.photoIcon}>◎</Text>
              <Text style={styles.photoButtonText}>Take photo</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={choosePhotos} style={styles.photoButton}>
              <Text style={styles.photoIcon}>▧</Text>
              <Text style={styles.photoButtonText}>Choose photos</Text>
            </Pressable>
          </View>
          {photos.length > 0 && (
            <ScrollView horizontal contentContainerStyle={styles.photoList} showsHorizontalScrollIndicator={false}>
              {photos.map((uri, index) => (
                <View key={`${uri}-${index}`} style={styles.photoThumbWrap}>
                  <Image source={{ uri }} style={styles.photoThumb} />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remove photo ${index + 1}`}
                    onPress={() => setPhotos((current) => current.filter((_, i) => i !== index))}
                    style={styles.removePhoto}>
                    <Text style={styles.removePhotoText}>×</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <Field label="Item name" required>
          <TextInput value={title} onChangeText={setTitle} placeholder="e.g. Vintage denim jacket" placeholderTextColor={palette.olive} style={styles.input} />
        </Field>
        <Field label="Description" required>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Share the details someone would want to know"
            placeholderTextColor={palette.olive}
            multiline
            style={[styles.input, styles.multiline]}
          />
        </Field>
        <View style={styles.row}>
          <Field label="Price ($)" required style={styles.half}>
            <TextInput value={price} onChangeText={setPrice} placeholder="45" placeholderTextColor={palette.olive} keyboardType="decimal-pad" style={styles.input} />
          </Field>
          <Field label="Original price" style={styles.half}>
            <TextInput value={originalPrice} onChangeText={setOriginalPrice} placeholder="Optional" placeholderTextColor={palette.olive} keyboardType="decimal-pad" style={styles.input} />
          </Field>
        </View>
        <Field label="Brand (optional)">
          <TextInput value={brand} onChangeText={setBrand} placeholder="Brand or independent" placeholderTextColor={palette.olive} style={styles.input} />
        </Field>
        <Field label="Color" required>
          <TextInput value={color} onChangeText={setColor} placeholder="e.g. Forest green" placeholderTextColor={palette.olive} style={styles.input} />
        </Field>
        <Field label="Material" required>
          <TextInput value={material} onChangeText={setMaterial} placeholder="e.g. 100% cotton" placeholderTextColor={palette.olive} style={styles.input} />
        </Field>
        <ChoiceField label="Category">
          {categories.map((item) => (
            <Pill key={item} selected={category === item} onPress={() => setCategory(item)}>{item}</Pill>
          ))}
        </ChoiceField>
        <ChoiceField label="Size">
          {sizes.map((item) => (
            <Pill key={item} selected={size === item} onPress={() => setSize(item)}>{item}</Pill>
          ))}
        </ChoiceField>
        <ChoiceField label="Condition">
          {conditions.map((item) => (
            <Pill key={item} selected={condition === item} onPress={() => setCondition(item)}>{item}</Pill>
          ))}
        </ChoiceField>

        {error !== '' && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        {published && (
          <View style={styles.success}>
            <Text style={styles.successTitle}>Your listing is live in this preview.</Text>
            <Text style={styles.successBody}>Find and manage it under My Listings on your profile.</Text>
            <Pressable accessibilityRole="button" onPress={() => router.navigate('/(tabs)/profile')}>
              <Text style={styles.successLink}>View My Listings →</Text>
            </Pressable>
          </View>
        )}
        <ActionButton label="Add listing" onPress={publishListing} />
        <Text style={styles.footnote}>Listings are kept for this app session; persistent storage is not connected yet.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({
  label,
  required = false,
  children,
  style,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}{required && <Text style={styles.required}> *</Text>}</Text>
      {children}
    </View>
  );
}

function ChoiceField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.choiceField}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.choices}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 20, paddingBottom: 34, gap: 17 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { marginBottom: 2, color: palette.terracotta, fontSize: 8, fontWeight: '700', letterSpacing: 1.1 },
  headerIcon: { width: 42, height: 42, textAlign: 'center', textAlignVertical: 'center', overflow: 'hidden', borderRadius: 22, backgroundColor: palette.cream, color: palette.terracotta, fontSize: 28 },
  title: { color: palette.ink, fontSize: 25, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { marginTop: -11, color: palette.muted, fontSize: 12, lineHeight: 18 },
  photoCard: { padding: 15, borderRadius: 17, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.paper },
  sectionTitle: { color: palette.ink, fontSize: 14, fontWeight: '700' },
  required: { color: palette.terracotta },
  help: { marginTop: 4, color: palette.muted, fontSize: 11 },
  photoActions: { flexDirection: 'row', gap: 10, marginTop: 13 },
  photoButton: { flex: 1, minHeight: 72, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 12, backgroundColor: palette.cream },
  photoIcon: { color: palette.terracotta, fontSize: 23 },
  photoButtonText: { color: palette.olive, fontSize: 11, fontWeight: '700' },
  photoList: { gap: 9, paddingTop: 13 },
  photoThumbWrap: { position: 'relative' },
  photoThumb: { width: 72, height: 82, borderRadius: 10, backgroundColor: palette.cream },
  removePhoto: { position: 'absolute', top: 3, right: 3, width: 22, height: 22, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: palette.paper },
  removePhotoText: { color: palette.terracotta, fontSize: 17, lineHeight: 20 },
  field: { gap: 7 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  label: { color: palette.ink, fontSize: 12, fontWeight: '700' },
  input: { minHeight: 47, paddingHorizontal: 13, borderWidth: 1, borderColor: palette.line, borderRadius: 12, color: palette.ink, backgroundColor: palette.paper, fontSize: 13 },
  multiline: { minHeight: 94, paddingTop: 12, textAlignVertical: 'top' },
  choiceField: { gap: 9 },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  error: { color: palette.terracotta, fontSize: 12, lineHeight: 18 },
  success: { padding: 14, borderRadius: 14, backgroundColor: palette.cream, gap: 5 },
  successTitle: { color: palette.olive, fontSize: 13, fontWeight: '700' },
  successBody: { color: palette.olive, fontSize: 11 },
  successLink: { marginTop: 5, color: palette.terracotta, fontSize: 12, fontWeight: '700' },
  footnote: { color: palette.muted, fontSize: 10, textAlign: 'center' },
});
