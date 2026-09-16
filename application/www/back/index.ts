import { Pool } from "pg";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import http from 'http';
import { WebSocketServer } from 'ws';

import { 
    ADD_ATTEMPT,
    ADD_ENTRY,
    ADD_LIFTER,
    DELETE_ATTEMPT,
    DELETE_ENTRY,
    DELETE_LIFTER,
    DISPLAY_ATTEMPT,
    LIST_ATTEMPTS_QUERY,
    LIST_COMPETITION_ENTRIES_QUERY,
    LIST_DIVISIONS_QUERY,
    LIST_LIFTERS_QUERY,
    LIST_WEIGHT_CLASS_QUERY
} from './select-list.js'

//k: ENV
dotenv.config({
  path: '../.env',
  quiet: true
});

//DB:
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT)
});
async function verifyConn() {
  try {
    const client = await pool.connect();
    console.log("CONN/POOL OK!");
    client.release();
  } catch(e) {
    console.error(e);
  }
}
verifyConn();

//MAIN:
const app = express();
const port = process.env.SITE_PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../front')));

//hand: Routes
//k: GET/ Main screen "/"
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../front/index.html'));
});

//k: GET/ List all Competition Entries "/list/entries"
app.get('/list/entries', async (_, res) => {
  try {
    const query = await pool.query(LIST_COMPETITION_ENTRIES_QUERY);
    res.json(query.rows);
  } catch(e) {
    console.error(e);
    res.json({ err: e });
    return;
  }
});
//k: GET/ List all Lifters "/list/lifters"
app.get('/list/lifters', async (_, res) => {
  try {
    const query = await pool.query(LIST_LIFTERS_QUERY);
    const rows = query.rows.map(item => ({
      ...item,
      b_day: item.b_day.toISOString().split('T')[0]
    }));
    res.json(rows);
  } catch(e) {
    console.error(e);
    res.json({ err: e });
    return;
  }
});
//k: GET/ List all Attempts "/list/attempts"
app.get('/list/attempts', async (_, res) => {
  try {
    const query = await pool.query(LIST_ATTEMPTS_QUERY);
    res.json(query.rows);
  } catch(e) {
    console.error(e);
    res.json({ err: e });
    return;
  }
});
//k: GET/ List all Divisions "/list/division"
app.get('/list/division', async (_, res) => {
  try {
    const query = await pool.query(LIST_DIVISIONS_QUERY);
    res.json(query.rows);
  } catch(e) {
    console.error(e);
    res.json({ err: e });
    return;
  }
});
//k: GET/ List all Weights "/list/weight"
app.get('/list/weight', async (_, res) => {
  try {
    const query = await pool.query(LIST_WEIGHT_CLASS_QUERY);
    res.json(query.rows);
  } catch(e) {
    console.error(e);
    res.json({ err: e });
    return;
  }
});
//hand: Routes



//fo: Lifters
//k: POST/ Add Lifter "/add/lifter"
app.post('/add/lifter', async (req, res) => {
  const body = req.body;

  let value = [];
  for (const index in body) {
    if (!body[index]) {
      res.json({ ok: false });
      return;
    }
    value.push(body[index]);
  }
  try {
    const query_s = await pool.query(ADD_LIFTER, value);
    if(query_s.rowCount === null || query_s.rowCount === 0) {
      res.json({ ok: false });
      return;
    }
    res.json({ ok: true });
    return;
  } catch(e) {
    console.error(e);
    res.json({ err: e });
    return;
  }
});

//k: POST/ Update Lifter "/update/lifter"
app.post('/update/lifter', async (req, res) => {
  const body = req.body;
  try {
    const ppl = await pool.query('SELECT id FROM lifters');
    const oid = ppl.rowCount !== null ? ppl.rowCount : 0;
    if (!body.l_id || (oid <= 0) || (body.l_id <= 0)) {
      res.json({ ok: false });
      return;
    }
  } catch(e) {
    console.error(e);
    res.json({ err: e });
    return;
  }
  const body_obj = Object.entries(body);
  let fields: string[] = [];
  let index = 1;
  let values: any = [];
  let id = null;
  body_obj.forEach(([k,v]) => {
    if (k === 'l_id') {
      id = v;
      return;
    }
    if (!v) { return };
    fields.push(`${k}=$${index}`);
    values.push(v);
    index++;
  });
  values.push(id);

  const query = `
  UPDATE lifters
  SET ${fields.join(', ')}
  WHERE id=$${index}
  `;
  try {
    const query_s = await pool.query(query, values);
    if(query_s.rowCount === null || query_s.rowCount === 0) {
      res.json({ ok: false });
      return;
    }
    res.json({ ok: true });
    return;
  } catch(e) {
    console.error(e);
    res.json({ err: e });
    return;
  }
});

//k: POST/ Delete Lifter "/delete/lifter"
app.post('/delete/lifter', (req,res) => {
  const obj_body = Object.entries(req.body)
  obj_body.forEach( async ([k, v]) => {
    if (!v) {
      res.json({ ok: false });
      return;
    }
    if (k === 'rem_id') {
      k = 'id'
    }
    try {
      const query_s = await pool.query(DELETE_LIFTER, [v]);
      if(query_s.rowCount === null || query_s.rowCount === 0) {
	res.json({ ok: false });
	return;
      }
      res.json({ ok: true });
      return;
    } catch(e) {
      console.error(e);
      res.json({ err: e });
      return;
    }
  })
});



//fo: Entries
//k: POST/ Add Entrie "/add/entry"
app.post('/add/entry', async(req,res) => {
  const body = req.body
  const body_obj = Object.entries(body);
  let values: any = [];
  body_obj.forEach(([_,v]) => {
    values.push(v)
  })
  try {
    const query_s = await pool.query(ADD_ENTRY, values);
    if(query_s.rowCount === null || query_s.rowCount === 0) {
      res.json({ ok: false });
      return;
    }
    res.json({ ok: true });
    return;
  } catch(e) {
    console.error(e);
    res.json({ err: e });
    return;
  }

});

//k: POST/ Update Entrie "/update/entry"
app.post('/update/entry', async(req,res) => {
  const body = req.body;
  try {
    const comp = await pool.query('SELECT id FROM competition_entries');
    const oid = comp.rowCount !== null ? comp.rowCount : 0;
    if (!body.comp_id || (oid <= 0) || (body.comp_id <= 0)) {
      res.json({ ok: false });
      return;
    }
  } catch(e) {
    console.error(e);
    res.json({ err: e });
    return;
  }
  const comp_obj = Object.entries(body);
  let fields: string[] = [];
  let index = 1;
  let values: any = [];
  let id = null;
  comp_obj.forEach(([k,v]) => {
    switch(k) {
      case 'comp_id':
	id = v;
      return;
      case 'division_name': 
	k = 'division_id'
      break;
      case 'weight_class_name': 
	k = 'weight_class_id'
      break;
      case 'record':
	k = 'record_disqualified'
	break;
    }
    if (!v) { return };
    fields.push(`${k}=$${index}`);
    values.push(v);
    index++;
  });
  values.push(id);

  const query = `
  UPDATE competition_entries
  SET ${fields.join(', ')}
  WHERE id=$${index}
  `;
  try {
    const query_s = await pool.query(query, values);
    if(query_s.rowCount === null || query_s.rowCount === 0) {
      res.json({ ok: false });
      return;
    }
    res.json({ ok: true });
    return;
  } catch(e) {
    console.error(e);
    res.json({ err: e });
    return;
  }
});

//k: POST/ Delete Entry "/delete/entry"
app.post('/delete/entry', (req,res) => {
  const obj_body = Object.entries(req.body)
  obj_body.forEach( async ([k, v]) => {
    if (!v) {
      res.json({ ok: false });
      return;
    }
    if (k === 'rem_id') {
      k = 'id'
    }
    try {
      const query_s = await pool.query(DELETE_ENTRY, [v]);
      if(query_s.rowCount === null || query_s.rowCount === 0) {
	res.json({ ok: false });
	return;
      }
      res.json({ ok: true });
      return;
    } catch(e) {
      console.error(e);
      res.json({ err: e });
      return;
    }
  })
});



//fo: Attempts
//k: POST/ Add Attempt "/add/attempt"
app.post('/add/attempt', async (req,res) => {
  const body = req.body
  const body_obj = Object.entries(body);
  let values: any = [];
  body_obj.forEach(([_,v]) => {
    values.push(v)
  })
  try {
      const query_s = await pool.query(ADD_ATTEMPT, values);
      if(query_s.rowCount === null || query_s.rowCount === 0) {
	res.json({ ok: false });
	return;
      }
      res.json({ ok: true });
      return;
  } catch(e) {
    console.error(e);
    res.json({ err: e });
    return;
  }

});

//k: POST/ Update Attempt "/update/attempt"
app.post('/update/attempt', async (req,res) => {
  const body = req.body;
  try {
    const ppl = await pool.query('SELECT id FROM attempts');
    const oid = ppl.rowCount !== null ? ppl.rowCount : 0;
    if (!body.at_id || (oid <= 0) || (body.at_id <= 0)) {
      res.json({ ok: false });
      return;
    }
  } catch(e) {
    console.error(e);
    res.json({ err: e });
    return;
  }
  const body_obj = Object.entries(body);
  let fields: string[] = [];
  let index = 1;
  let values: any = [];
  let id = null;
  body_obj.forEach(([k,v]) => {
    if (k === 'at_id') {
      id = v;
      return;
    }
    if (!v) { return };
    fields.push(`${k}=$${index}`);
    values.push(v);
    index++;
  });
  values.push(id);

  const query = `
  UPDATE attempts
  SET ${fields.join(', ')}
  WHERE id=$${index}
  `;
  try {
    const query_s = await pool.query(query, values);
    if(query_s.rowCount === null || query_s.rowCount === 0) {
      res.json({ ok: false });
      return;
    }
    res.json({ ok: true });
    return;
  } catch(e) {
    console.error(e);
    res.json({ err: e });
    return;
  }
});

//k: POST/ Delete Attempt "/delete/attempt"
app.post('/delete/attempt', async (req,res) => {
  const obj_body = Object.entries(req.body)
  obj_body.forEach( async ([k, v]) => {
    if (!v) {
      res.json({ ok: false });
      return;
    }
    if (k === 'at_id') {
      k = 'id'
    }
    try {
      const query_s = await pool.query(DELETE_ATTEMPT, [v]);
      if(query_s.rowCount === null || query_s.rowCount === 0) {
	res.json({ ok: false });
	return;
      }
      res.json({ ok: true });
      return;
    } catch(e) {
      console.error(e);
      res.json({ err: e });
      return;
    }
  })
});


const server = http.createServer(app)
const wss = new WebSocketServer({ server: server })

//fo: Display page
//k: GET/ Display Page "/display"
app.get('/display', (_,res)=>{
  res.sendFile(path.join(__dirname, '../front/display.html'));
})
//k: POST/ WebSocket for Display page "/send/display"
app.post('/send/display', async (req,res) => {
  const message = await pool.query(DISPLAY_ATTEMPT, [req.body.rem_id])

  wss.clients.forEach((client) => {
    if(client.readyState === 1) {
      client.send(JSON.stringify(message.rows))
    }
  })
  res.json({ ok: true });
})




//hand: Listen
server.listen( port, () => {
  console.log(`Listening on port: ${port}`);
});


//k: CTRL + C 
process.on('SIGINT', () => {
  process.exit(0);
})
