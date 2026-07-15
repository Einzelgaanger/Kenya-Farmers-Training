import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { toast } from 'sonner';

interface DocFile {
  id: string;
  name: string;
  category: string;
  sizeLabel: string;
}

const CATEGORIES = ['Invoice', 'Contract', 'Delivery note', 'Supporting doc'];

/** Document attach UI — adapted from Malipo Polepole document upload (mock storage) */
export default function DocumentAttach({ onChange }: { onChange?: (files: DocFile[]) => void }) {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const next = [...files];
    Array.from(list).forEach(file => {
      next.push({
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        category,
        sizeLabel: file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`,
      });
    });
    setFiles(next);
    onChange?.(next);
    toast.success(`${list.length} file(s) attached`);
  };

  const remove = (id: string) => {
    const next = files.filter(f => f.id !== id);
    setFiles(next);
    onChange?.(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-primary/40 rounded-lg text-sm text-primary hover:bg-brand-blue-light transition-colors"
        >
          <Upload size={16} />
          Attach documents
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={e => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map(f => (
            <li key={f.id} className="flex items-center gap-3 px-3 py-2 bg-secondary/50 rounded-lg text-sm">
              <FileText size={16} className="text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.category} · {f.sizeLabel}</p>
              </div>
              <button type="button" onClick={() => remove(f.id)} className="p-1 hover:bg-secondary rounded">
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
