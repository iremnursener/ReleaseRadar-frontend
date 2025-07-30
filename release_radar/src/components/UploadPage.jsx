import React, { useCallback, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Chip,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [excelData, setExcelData] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        readExcel(uploadedFile);
    }, []);

    const readExcel = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setExcelData(json);
        };
        reader.readAsArrayBuffer(file);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
        },
    });

    const handleRemoveFile = () => {
        setFile(null);
        setExcelData([]);
    };

    const handleSave = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('http://localhost:8080/api/import/upload', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include' // eğer login gerekiyor ve cookie varsa
                });

                if (response.ok) {
                    alert("Yükleme başarılı!");
                } else {
                    alert("Yükleme sırasında hata oluştu.");
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert("Sunucu hatası.");
            }
        }
    };

    return (
        <Box sx={{ maxWidth: '900px', mx: 'auto', mt: 6, p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Yapı Kredi Release Takibi Bilgilendirme Otomasyonu Sistemi
            </Typography>
            <Typography variant="body1" gutterBottom>
                Aşağıdaki dosya yükleme kısmına yıllık takvimi excel formatında yükleyin ve kaydet butonuna basın.
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Yüklenen dosya sisteme kaydedildikten sonra gerekli birimlere tarihlerden 5 gün öncesinde mail yoluyla hatırlatma yollanır.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
                <Paper
                    {...getRootProps()}
                    variant="outlined"
                    sx={{
                        flex: 1,
                        p: 3,
                        textAlign: 'center',
                        border: '2px dashed #ccc',
                        cursor: 'pointer',
                        minHeight: 150,
                    }}
                >
                    <input {...getInputProps()} />
                    <CloudUploadIcon color="primary" sx={{ fontSize: 40 }} />
                    <Typography mt={2}>
                        {isDragActive
                            ? 'Dosyayı buraya bırakın...'
                            : 'Dosyaları buraya sürükleyebilir ya da '}
                        <span style={{ color: '#1976d2', textDecoration: 'underline' }}>
                            dosya seçebilirsiniz.
                        </span>
                    </Typography>
                </Paper>

                <Paper
                    variant="outlined"
                    sx={{
                        flex: 1,
                        minHeight: 150,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {file ? (
                        <Chip
                            icon={<InsertDriveFileIcon />}
                            label={file.name}
                            onDelete={handleRemoveFile}
                            deleteIcon={<CloseIcon />}
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: 16, p: 2 }}
                        />
                    ) : (
                        <Typography>Henüz bir dosya yüklenmedi</Typography>
                    )}
                </Paper>
            </Box>

            {/* Excel Preview */}
            {excelData.length > 0 && (
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Excel Önizleme
                    </Typography>
                    <Paper variant="outlined" sx={{ overflow: 'auto', maxHeight: 300 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {excelData[0].map((col, i) => (
                                        <TableCell key={i} sx={{ fontWeight: 'bold' }}>
                                            {col}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {excelData.slice(1).map((row, i) => (
                                    <TableRow key={i}>
                                        {row.map((cell, j) => (
                                            <TableCell key={j}>{cell}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>
            )}

            <Box mt={4} display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={handleSave} disabled={!file}>
                    Kaydet
                </Button>
            </Box>
        </Box>
    );
};

export default UploadPage;
