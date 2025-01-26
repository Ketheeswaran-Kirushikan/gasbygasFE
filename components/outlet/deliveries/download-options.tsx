import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTranslation } from '@/hooks/use-translation'

interface DownloadOptionsProps {
  isOpen: boolean
  onClose: () => void
  onDownload: (fileType: string) => void
}

export function DownloadOptions({ isOpen, onClose, onDownload }: DownloadOptionsProps) {
  const [fileType, setFileType] = useState('pdf')
  const { t } = useTranslation()

  const handleDownload = () => {
    onDownload(fileType)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('Select Download Format')}</DialogTitle>
        </DialogHeader>
        <Select value={fileType} onValueChange={setFileType}>
          <SelectTrigger>
            <SelectValue placeholder={t('Select file type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="xlsx">Excel</SelectItem>
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t('Cancel')}</Button>
          <Button onClick={handleDownload}>{t('Download')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

