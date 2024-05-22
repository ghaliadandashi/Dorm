const cheerio = require('cheerio');
const axios = require('axios');
const cron = require('node-cron');

const url = 'https://www.emu.edu.tr/academiccalendar';

const getSemesterStartDate = async () => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        
        const monthMap = {
            'January': '01', 'February': '02', 'March': '03', 'April': '04', 'May': '05', 'June': '06',
            'July': '07', 'August': '08', 'September': '09', 'October': '10', 'November': '11', 'December': '12'
        };

        const semesterDates = [];
        $('table tbody tr').each((index, element) => {
            const eventTitle = $(element).find('td:nth-child(4)').text().trim();
            if (eventTitle.toLowerCase().includes('classes commence')) {
                const day = $(element).find('td:nth-child(2)').text().trim();
                const month = $(element).find('td:nth-child(1)').text().trim();
                const year = $(element).find('td:nth-child(3)').text().trim();
                const formattedDate = `${year}-${monthMap[month]}-${day}`;
                semesterDates.push(new Date(formattedDate));
            }
        });

        return semesterDates
        // console.log('Semester Start Date:', semesterDates);
    } catch (error) {
        console.error('Error fetching semester start date:', error);
    }
};

cron.schedule('0 0 * * *', () => {
    console.log('Running script every day at midnight');
    getSemesterStartDate();
});

module.exports = getSemesterStartDate