export const theme = {
    colors: {
        // Light Theme Palette
        background: '#FFFFFF',      // White background
        card: '#F8F9FA',            // Very light gray for cards/sections
        text: '#1A1A1A',            // Almost black for primary text
        textSecondary: '#666666',   // Gray for subtitles
        primary: '#D4AF37',         // Metallic Gold (Premium)
        primaryDark: '#B4941F',     // Darker Gold for accents/borders
        secondary: '#1C1C1E',       // Dark contrast
        accent: '#E5C15D',          // Lighter Gold
        success: '#2E8B57',         // Sea Green for "Attended" / "Start"
        danger: '#E74C3C',          // Red for "Unattended" / "Delete"
        info: '#3498DB',            // Blue for "Resume"
        warning: '#F1C40F',         // Yellow for "Edit"
        white: '#FFFFFF',
        black: '#000000',
        border: '#E0E0E0',
        shadow: '#000000',
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    typography: {
        header: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#1A1A1A', // Dark text matches theme.colors.text
        },
        subHeader: {
            fontSize: 18,
            fontWeight: '600',
            color: '#666666',
        },
        body: {
            fontSize: 14,
            color: '#1A1A1A',
        }
    }
};
