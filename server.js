const express = require('express');

const app = express();

const db = require('./models');

const { Member } = db;

app.use(express.json());

app.use((req, res, next) => {
    const { query } = req;
    console.log(query);
    next();
});

app.get('/api/members', async (req, res) => {
    const { team } = req.query;
    if (team) {
        const teamMembers = await Member.findAll({ where: { team } });
        res.send(teamMembers);
    } else {
        const members = await Member.findAll();
        res.send(members);
    }
});

app.get('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const member = await Member.findOne({ where: { id } });
    if (member) {
        console.log(member.toJSON());
        res.send(member);
    } else {
        res.status(404).send({ message: 'no member' });
    }
});

app.post('/api/members', async (req, res) => {
    const newMember = req.body;
    const member = Member.build(newMember);
    await member.save();
    res.send(member);
});

// app.put('/api/members/:id', async (req, res) => {
//     const { id } = req.params;
//     const newInfo = req.body;
//     const result = await Member.update(newInfo, { where: { id } });

//     if (result[0]) {
//         res.send({ message: `${result[0]} row(s) affected` });
//     } else {
//         res.status(404).send({ message: 'no member' });
//     }
// });

app.put('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const newInfo = req.body;
    const member = await Member.findOne({ where: { id } });
    Object.keys(newInfo).forEach((prop) => {
        member[prop] = newInfo[prop];
    });
    await member.save();
    res.send(member);
});

app.delete('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const deletedCount = await Member.destroy({ where: { id } });
    if (deletedCount) {
        res.send({ message: `${deletedCount} row(s) deleted` });
    } else {
        res.status(404).send({ message: 'no member' });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server Start');
});
