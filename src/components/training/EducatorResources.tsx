import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, BookOpen, Music, Plus, Trash2 } from 'lucide-react';
import { ONBOARDING_SECTIONS } from '@/data/onboarding';

interface CustomLink {
  title: string;
  url: string;
}

const BOOK_SECTION = ONBOARDING_SECTIONS.find((s) => s.key === 'book_recommendations');
const OPENING_SONGS = ONBOARDING_SECTIONS.find((s) => s.key === 'opening_circle_songs');
const CLOSING_SONGS = ONBOARDING_SECTIONS.find((s) => s.key === 'closing_circle_songs');

export default function EducatorResources({ onBack }: { onBack: () => void }) {
  const [customBooks, setCustomBooks] = useState<CustomLink[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const [customSongs, setCustomSongs] = useState<CustomLink[]>([]);
  const [newSongTitle, setNewSongTitle] = useState('');
  const [newSongUrl, setNewSongUrl] = useState('');

  const handleAddBook = () => {
    const title = newTitle.trim();
    const url = newUrl.trim();
    if (!title || !url) return;
    setCustomBooks((prev) => [...prev, { title, url }]);
    setNewTitle('');
    setNewUrl('');
  };

  const handleRemoveBook = (index: number) => {
    setCustomBooks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSong = () => {
    const title = newSongTitle.trim();
    const url = newSongUrl.trim();
    if (!title || !url) return;
    setCustomSongs((prev) => [...prev, { title, url }]);
    setNewSongTitle('');
    setNewSongUrl('');
  };

  const handleRemoveSong = (index: number) => {
    setCustomSongs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm text-primary hover:underline">
        ← Back to modules
      </button>

      <div>
        <h2 className="text-lg font-bold mb-1">Educator Resources</h2>
        <p className="text-sm text-muted-foreground">Recommended books, songs, and rhymes for sessions.</p>
      </div>

      {/* Books Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Books — Recommended</h3>
        </div>
        <p className="text-xs text-muted-foreground">{BOOK_SECTION?.description}</p>

        <div className="space-y-2">
          {BOOK_SECTION?.resourceLinks?.map((link) => (
            <Card key={link.url} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-3 flex items-center justify-between gap-2">
                <span className="text-sm">{link.label}</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 flex-shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom books added by educator */}
        {customBooks.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-sm font-medium text-muted-foreground">Your Suggestions</h4>
            {customBooks.map((book, i) => (
              <Card key={i}>
                <CardContent className="p-3 flex items-center justify-between gap-2">
                  <span className="text-sm">{book.title}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={book.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleRemoveBook(i)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add custom book form */}
        <Card className="border-dashed">
          <CardContent className="p-4 space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              Suggest a Book
            </h4>
            <div className="space-y-2">
              <div>
                <Label htmlFor="book-title" className="text-xs">Book Title</Label>
                <Input
                  id="book-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Brown Bear, Brown Bear"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="book-url" className="text-xs">Amazon Link</Label>
                <Input
                  id="book-url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://www.amazon.in/..."
                  className="mt-1"
                />
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleAddBook}
              disabled={!newTitle.trim() || !newUrl.trim()}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Book
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Songs & Rhymes Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Songs & Rhymes</h3>
        </div>

        {/* Opening Circle Songs */}
        {OPENING_SONGS && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">{OPENING_SONGS.title}</h4>
            <p className="text-xs text-muted-foreground">{OPENING_SONGS.description}</p>
            {OPENING_SONGS.resourceLinks?.map((link) => (
              <Card key={link.url} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-3 flex items-center justify-between gap-2">
                  <span className="text-sm">{link.label}</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Closing Circle Songs */}
        {CLOSING_SONGS && (
          <div className="space-y-2 pt-3">
            <h4 className="text-sm font-medium">{CLOSING_SONGS.title}</h4>
            <p className="text-xs text-muted-foreground">{CLOSING_SONGS.description}</p>
            {CLOSING_SONGS.resourceLinks?.map((link) => (
              <Card key={link.url} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-3 flex items-center justify-between gap-2">
                  <span className="text-sm">{link.label}</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Custom songs added by educator */}
        {customSongs.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-sm font-medium text-muted-foreground">Your Suggestions</h4>
            {customSongs.map((song, i) => (
              <Card key={i}>
                <CardContent className="p-3 flex items-center justify-between gap-2">
                  <span className="text-sm">{song.title}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={song.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleRemoveSong(i)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add custom song form */}
        <Card className="border-dashed">
          <CardContent className="p-4 space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              Suggest a Song or Rhyme
            </h4>
            <div className="space-y-2">
              <div>
                <Label htmlFor="song-title" className="text-xs">Song / Rhyme Name</Label>
                <Input
                  id="song-title"
                  value={newSongTitle}
                  onChange={(e) => setNewSongTitle(e.target.value)}
                  placeholder="e.g. Twinkle Twinkle Little Star"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="song-url" className="text-xs">YouTube Link</Label>
                <Input
                  id="song-url"
                  value={newSongUrl}
                  onChange={(e) => setNewSongUrl(e.target.value)}
                  placeholder="https://www.youtube.com/..."
                  className="mt-1"
                />
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleAddSong}
              disabled={!newSongTitle.trim() || !newSongUrl.trim()}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Song
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
