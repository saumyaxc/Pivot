import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark, palette } from '@/components/pivot-ui';
import { useShop, type MessageThread } from '@/state/shop-store';

export default function MessagesScreen() {
  const { threads, sendMessage } = useShop();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const thread = threads.find((item) => item.id === selectedThread);

  const submitMessage = () => {
    const message = draft.trim();
    if (!thread || !message) return;
    sendMessage(thread.id, message);
    setDraft('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {thread ? (
        <ThreadView
          thread={thread}
          draft={draft}
          onChangeDraft={setDraft}
          onBack={() => {
            setSelectedThread(null);
            setDraft('');
          }}
          onSend={submitMessage}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.kicker}>GOOD THINGS START WITH A HELLO</Text>
              <BrandMark />
            </View>
            <Text style={styles.headerIcon}>✉</Text>
          </View>
          <Text style={styles.title}>Messages</Text>
          <Text style={styles.subtitle}>Offers and conversations with your Pivot community.</Text>
          {threads.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>♡</Text>
              <Text style={styles.emptyTitle}>Your inbox is ready</Text>
              <Text style={styles.emptyBody}>Make a bid on a listing to start a conversation with its seller.</Text>
            </View>
          ) : (
            <View style={styles.threadList}>
              {threads.map((item) => (
                <ThreadCard key={item.id} thread={item} onPress={() => setSelectedThread(item.id)} />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function ThreadCard({ thread, onPress }: { thread: MessageThread; onPress: () => void }) {
  const lastMessage = thread.messages[thread.messages.length - 1];
  const pendingBid = [...thread.messages].reverse().find((message) => message.bidAmount !== undefined);
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.threadCard}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{thread.seller[0]}</Text></View>
      <View style={styles.threadCopy}>
        <View style={styles.threadHeading}>
          <Text style={styles.threadName}>{thread.seller}</Text>
          <Text style={styles.threadTime}>{formatTime(lastMessage.createdAt)}</Text>
        </View>
        <Text numberOfLines={1} style={styles.threadItem}>{thread.productName}</Text>
        <Text numberOfLines={1} style={styles.preview}>{lastMessage.text}</Text>
        {pendingBid && (
          <Text style={styles.offerBadge}>
            Bid · ${pendingBid.bidAmount?.toFixed(2)} · {pendingBid.bidStatus}
          </Text>
        )}
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

function ThreadView({
  thread,
  draft,
  onChangeDraft,
  onBack,
  onSend,
}: {
  thread: MessageThread;
  draft: string;
  onChangeDraft: (value: string) => void;
  onBack: () => void;
  onSend: () => void;
}) {
  return (
    <View style={styles.threadScreen}>
      <View style={styles.threadHeader}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.threadName}>{thread.seller}</Text>
          <Text style={styles.headerSubtitle}>{thread.productName}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.messageList} showsVerticalScrollIndicator={false}>
        <Text style={styles.conversationNote}>Conversation about “{thread.productName}”</Text>
        {thread.messages.map((message) => (
          <View key={message.id} style={[styles.bubble, message.isMine ? styles.myBubble : styles.theirBubble]}>
            <Text style={[styles.bubbleText, message.isMine && styles.myBubbleText]}>{message.text}</Text>
            {message.bidAmount !== undefined && (
              <Text style={[styles.bidStatus, message.isMine && styles.myBubbleText]}>
                Offer · ${message.bidAmount.toFixed(2)} · {message.bidStatus}
              </Text>
            )}
            <Text style={[styles.messageTime, message.isMine && styles.myBubbleText]}>
              {formatTime(message.createdAt)}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.composer}>
        <TextInput
          accessibilityLabel="Write a message"
          value={draft}
          onChangeText={onChangeDraft}
          placeholder="Write a message…"
          placeholderTextColor={palette.olive}
          multiline
          style={styles.composerInput}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send message"
          disabled={!draft.trim()}
          onPress={onSend}
          style={[styles.sendButton, !draft.trim() && styles.disabled]}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 20, paddingBottom: 30, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { marginBottom: 2, color: palette.terracotta, fontSize: 8, fontWeight: '700', letterSpacing: 1.1 },
  headerIcon: { width: 42, height: 42, textAlign: 'center', textAlignVertical: 'center', overflow: 'hidden', borderRadius: 22, backgroundColor: palette.cream, color: palette.terracotta, fontSize: 20 },
  title: { marginTop: 2, color: palette.ink, fontSize: 25, fontWeight: '700' },
  subtitle: { marginTop: -11, color: palette.muted, fontSize: 12, lineHeight: 18 },
  empty: { marginTop: 28, paddingHorizontal: 25, paddingVertical: 52, alignItems: 'center', borderRadius: 20, backgroundColor: palette.cream },
  emptyIcon: { color: palette.terracotta, fontSize: 35 },
  emptyTitle: { marginTop: 12, color: palette.ink, fontSize: 17, fontWeight: '700' },
  emptyBody: { marginTop: 7, color: palette.olive, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  threadList: { overflow: 'hidden', borderRadius: 17, borderWidth: 1, borderColor: palette.line },
  threadCard: { minHeight: 91, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 13, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: palette.line },
  avatar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 23, backgroundColor: palette.cream },
  avatarText: { color: palette.terracotta, fontSize: 17, fontWeight: '700' },
  threadCopy: { flex: 1 },
  threadHeading: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  threadName: { color: palette.ink, fontSize: 13, fontWeight: '700' },
  threadTime: { color: palette.muted, fontSize: 9 },
  threadItem: { marginTop: 2, color: palette.terracotta, fontSize: 10, fontWeight: '600' },
  preview: { marginTop: 4, color: palette.olive, fontSize: 10 },
  offerBadge: { alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 8, paddingVertical: 4, overflow: 'hidden', borderRadius: 9, backgroundColor: palette.cream, color: palette.terracotta, fontSize: 9, fontWeight: '700' },
  chevron: { color: palette.terracotta, fontSize: 23 },
  threadScreen: { flex: 1 },
  threadHeader: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: palette.line },
  backButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: palette.cream },
  backText: { color: palette.terracotta, fontSize: 28, lineHeight: 31 },
  headerCopy: { flex: 1 },
  headerSubtitle: { marginTop: 2, color: palette.olive, fontSize: 10 },
  messageList: { flexGrow: 1, alignItems: 'stretch', padding: 16, gap: 12 },
  conversationNote: { alignSelf: 'center', marginVertical: 8, color: palette.muted, fontSize: 10 },
  bubble: { maxWidth: '84%', padding: 12, borderRadius: 15 },
  myBubble: { alignSelf: 'flex-end', backgroundColor: palette.olive },
  theirBubble: { alignSelf: 'flex-start', backgroundColor: palette.cream },
  bubbleText: { color: palette.ink, fontSize: 12, lineHeight: 17 },
  myBubbleText: { color: palette.paper },
  bidStatus: { marginTop: 6, color: palette.terracotta, fontSize: 10, fontWeight: '700' },
  messageTime: { marginTop: 6, color: palette.olive, fontSize: 8, textAlign: 'right' },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 9, paddingHorizontal: 14, paddingVertical: 11, borderTopWidth: 1, borderTopColor: palette.line },
  composerInput: { flex: 1, minHeight: 42, maxHeight: 110, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: palette.line, borderRadius: 14, color: palette.ink, fontSize: 12 },
  sendButton: { minHeight: 42, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 13, backgroundColor: palette.olive },
  sendButtonText: { color: palette.paper, fontSize: 11, fontWeight: '700' },
  disabled: { opacity: 0.45 },
});
