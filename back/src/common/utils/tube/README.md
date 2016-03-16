tube
====

Tube is an implementation of publisher / subscriber pattern.

# Generator
 - should implement the `_start` method and start publishing items from then.
 - use internal `push` and `pushBatch` to publish items.
 - use internal `end` when it's over.

# Consumer
 - should try to pull items with `pull`, `pullN`, `pullAll`.
    this return either an items ( or a batch of items ) or null if nothing is available.
 - should implement `_dataAvailable`. Which tells that at least one more items is available.
 - should implement `_dataEnded`. Which tells that the publisher have finish to publish.
