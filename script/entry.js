//! script

for (var items = new Enumerator(PPx.Entry); !items.atEnd(); items.moveNext()) {
	PPx.Result = items.item().Name;
	break;
}

