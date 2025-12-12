// ASCII Art Data with descriptions and Wikimedia Commons image URLs (public domain)
const artworkData = {
    'girl-pearl': {
        title: 'Girl with a Pearl Earring',
        artist: 'Johannes Vermeer (1665)',
        description: 'Vermeer\'s masterful play of light becomes a study in character density. The luminous pearl, once painted with precious pigments, now glows through careful placement of bright characters against darker backgrounds.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg',
        comparison: 'Vermeer\'s original showcases masterful light reflection on the pearl and the subject\'s luminous skin. The ASCII version uses the "O" character to represent the iconic pearl, with careful spacing to suggest the gentle turn of the head.'
    }
};

// DOM Elements
const modal = document.getElementById('modal');
const modalAscii = document.getElementById('modal-ascii');
const modalDescription = document.getElementById('modal-description');
const modalClose = document.getElementById('modal-close');
const downloadBtn = document.getElementById('download-btn');

let currentArtworkId = null;

// Load pre-generated colored ASCII art HTML files
async function loadAsciiArt() {
    const artworkId = 'girl-pearl';
    try {
        const response = await fetch(`assets/ascii/${artworkId}.html`);
        if (response.ok) {
            const asciiHtml = await response.text();
            const element = document.getElementById(artworkId);
            if (element) {
                element.innerHTML = asciiHtml;
            }
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error(`Error loading ${artworkId}:`, error);
        const element = document.getElementById(artworkId);
        if (element) {
            element.innerHTML = '<span style="color:#f66">Failed to load</span>';
        }
    }
}

// Open modal with artwork
function openModal(artworkId) {
    currentArtworkId = artworkId;
    const artwork = artworkData[artworkId];
    const asciiElement = document.getElementById(artworkId);
    
    if (artwork && asciiElement) {
        // Copy colored HTML content
        modalAscii.innerHTML = asciiElement.innerHTML;
        modalDescription.textContent = artwork.description;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentArtworkId = null;
}

// Download as PDF with submission info, original image, ASCII art side-by-side, and comparison
async function downloadPdf() {
    if (!currentArtworkId) return;
    
    const artwork = artworkData[currentArtworkId];
    const asciiElement = document.getElementById(currentArtworkId);
    
    // Get the colored ASCII HTML content
    const asciiHtml = asciiElement ? asciiElement.innerHTML : '';
    
    // Create PDF content element - fixed size to prevent page overflow
    const pdfContent = document.createElement('div');
    pdfContent.style.cssText = `
        width: 210mm;
        height: 287mm;
        max-height: 287mm;
        padding: 12mm 15mm;
        background: #0d0d1a;
        font-family: 'Courier New', monospace;
        color: #e8e8e8;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
    `;
    
    pdfContent.innerHTML = `
        <!-- Header with submission info -->
        <div style="text-align: center; margin-bottom: 6mm; border-bottom: 2px solid #d4af37; padding-bottom: 4mm;">
            <h1 style="color: #d4af37; margin: 0 0 2mm 0; font-size: 13px; letter-spacing: 1px;">Project in Reading Visual Arts</h1>
            <p style="color: #c0c0c0; font-size: 9px; margin: 1mm 0;">Submitted by: <strong style="color: #f4e4ba;">Herald Carl Avila</strong> | BSCS 4B</p>
            <p style="color: #c0c0c0; font-size: 9px; margin: 0;">Submitted to: <strong style="color: #f4e4ba;">Ma'am Elsa Regalado</strong></p>
        </div>
        
        <!-- Artwork Title -->
        <div style="text-align: center; margin-bottom: 4mm;">
            <h2 style="color: #d4af37; margin: 0 0 1mm 0; font-size: 14px;">${artwork.title}</h2>
            <p style="color: #a67c00; font-size: 10px; margin: 0;">${artwork.artist}</p>
        </div>
        
        <!-- Side-by-side: Original Image and ASCII Art -->
        <div style="display: flex; justify-content: space-between; gap: 4mm; margin-bottom: 4mm; height: 70mm;">
            <!-- Original Image -->
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; border: 2px solid #d4af37; border-radius: 4px; padding: 2mm; background: #1a1a2e; overflow: hidden;">
                <p style="color: #d4af37; font-size: 8px; margin: 0 0 1mm 0; font-weight: bold;">Original Artwork</p>
                <img src="${artwork.imageUrl}" alt="${artwork.title}" style="max-width: 100%; max-height: 58mm; object-fit: contain; border-radius: 2px;" crossorigin="anonymous" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <p style="display: none; color: #888; font-size: 7px; text-align: center;">Image unavailable</p>
            </div>
            
            <!-- ASCII Art -->
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; border: 2px solid #d4af37; border-radius: 4px; padding: 2mm; background: #1a1a2e; overflow: hidden;">
                <p style="color: #d4af37; font-size: 8px; margin: 0 0 1mm 0; font-weight: bold;">ASCII Art Interpretation</p>
                <pre style="font-size: 4.2px; line-height: 4.6px; text-align: center; white-space: pre; overflow: hidden; margin: 0; max-height: 58mm;">${asciiHtml}</pre>
            </div>
        </div>
        
        <!-- Description -->
        <div style="border-top: 1px solid #d4af37; padding-top: 3mm; margin-bottom: 3mm;">
            <h3 style="color: #d4af37; font-size: 9px; margin: 0 0 1mm 0;">About This Artwork</h3>
            <p style="font-style: italic; color: #c0c0c0; font-size: 8px; line-height: 1.4; margin: 0;">${artwork.description}</p>
        </div>
        
        <!-- Comparison Section -->
        <div style="border-top: 1px solid #d4af37; padding-top: 3mm;">
            <h3 style="color: #d4af37; font-size: 9px; margin: 0 0 1mm 0;">Comparison: Original vs ASCII</h3>
            <p style="color: #c0c0c0; font-size: 8px; line-height: 1.4; margin: 0;">${artwork.comparison}</p>
        </div>
        
        <!-- Footer -->
        <div style="position: absolute; bottom: 8mm; left: 15mm; right: 15mm; text-align: center; border-top: 1px solid #a67c00; padding-top: 2mm;">
            <p style="color: #888; font-size: 7px; margin: 0;">ASCII Art Gallery Project • Reading Visual Arts • ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
    `;
    
    document.body.appendChild(pdfContent);
    
    const opt = {
        margin: 0,
        filename: `${currentArtworkId}-ascii-art.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            backgroundColor: '#0d0d1a',
            useCORS: true,
            allowTaint: true,
            height: 1122, // A4 height in pixels at 96 DPI
            windowHeight: 1122
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: 'avoid-all' }
    };
    
    try {
        await html2pdf().set(opt).from(pdfContent).save();
    } catch (error) {
        console.error('PDF generation failed:', error);
    }
    
    document.body.removeChild(pdfContent);
}

// Event Listeners
document.querySelectorAll('.artwork').forEach(artwork => {
    artwork.addEventListener('click', () => {
        const id = artwork.dataset.id;
        openModal(id);
    });
});

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

downloadBtn.addEventListener('click', downloadPdf);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', loadAsciiArt);
