var chai = require('chai');
var expect = chai.expect;

var removeEntity = require('../removeEntity').removeEntity;

describe('basic', function() {
    it('should remove mustDeps', () => {
        var dep = {
            mustDeps: {
                block: 'page'
            }
        };

        expect(removeEntity({block: 'page'}, dep)).to.eql([]);
    });

    it('should remove shouldDeps', () => {
        var dep = {
            shouldDeps: {
                block: 'i-ua'
            }
        };

        expect(removeEntity({block: 'i-ua'}, dep)).to.eql([]);
    });

    it('should remove only mustDeps', () => {
        var dep = {
            mustDeps: {
                block: 'page'
            },
            shouldDeps: {
                block: 'i-ua'
            }
        };

        expect(removeEntity({block: 'page'}, dep)).to.eql([{ shouldDeps: [{ block: 'i-ua' }] }]);
    });

    it('should remove only shouldDeps', () => {
        var dep = {
            mustDeps: {
                block: 'page'
            },
            shouldDeps: {
                block: 'i-ua'
            }
        };

        expect(removeEntity({block: 'i-ua'}, dep)).to.eql([{ mustDeps: [{ block: 'page' }] }]);
    });

    it('should remove mustDeps & shouldDeps', () => {
        var dep = {
            mustDeps: {
                block: 'page'
            },
            shouldDeps: {
                block: 'page'
            }
        };

        expect(removeEntity({block: 'page'}, dep)).to.eql([]);
    });
});

describe('block', () => {
    it('should remove one block', () => {
        var dep = {
            mustDeps: [
                {block: 'page'},
                {block: 'i-ua'}
            ]
        };

        expect(removeEntity({block: 'page'}, dep)).to.eql([{
            mustDeps: [
                {block: 'i-ua'}
            ]
        }]);
    });

    it('should not remove block that does not match', () => {
        var dep = {
            mustDeps: [
                {block: 'page'},
                {block: 'i-ua'}
            ]
        };

        expect(removeEntity({block: 'doggy'}, dep)).to.eql([{
            mustDeps: [
                {block: 'page'},
                {block: 'i-ua'}
            ]
        }]);
    });
});

describe('elem', () => {
    describe('elemString', () => {
        describe('withBlock', () => {
            it('should remove elem and block', () => {
                var dep = {
                    mustDeps: [
                        {block: 'html', elem: 'page'},
                        {elem: 'i-ua'}
                    ]
                };

                expect(removeEntity({block: 'html', elem: 'page'}, dep)).to.eql([{
                    mustDeps: [
                        {elem: 'i-ua'}
                    ]
                }]);
            });

            it('should not remove elem from block if entity has no block field', () => {
                var dep = {
                    mustDeps: [
                        {block: 'html', elem: 'page'},
                        {elem: 'page'}
                    ]
                };

                expect(removeEntity({elem: 'page'}, dep)).to.eql([{
                    mustDeps: [
                        {block: 'html', elem: 'page'}
                    ]
                }]);
            });
        });

        it('should remove one elem', () => {
            var dep = {
                mustDeps: [
                    {elem: 'page'},
                    {elem: 'i-ua'}
                ]
            };

            expect(removeEntity({elem: 'page'}, dep)).to.eql([{
                mustDeps: [
                    {elem: 'i-ua'}
                ]
            }]);
        });

        it('should not remove elem that does not match', () => {
            var dep = {
                mustDeps: [
                    {elem: 'page'},
                    {elem: 'i-ua'}
                ]
            };

            expect(removeEntity({elem: 'doggy'}, dep)).to.eql([{
                mustDeps: [
                    {elem: 'page'},
                    {elem: 'i-ua'}
                ]
            }]);
        });

        it('should not remove elem if it has same name as block', () => {
            var dep = {
                mustDeps: [
                    {elem: 'page'},
                    {elem: 'i-ua'}
                ]
            };

            expect(removeEntity({block: 'page'}, dep)).to.eql([{
                mustDeps: [
                    {elem: 'page'},
                    {elem: 'i-ua'}
                ]
            }]);
        });

        it('should remove only block if it has same name as elem', () => {
            var dep = {
                mustDeps: [
                    {block: 'page'},
                    {elem: 'page'}
                ]
            };

            expect(removeEntity({block: 'page'}, dep)).to.eql([{
                mustDeps: [
                    {elem: 'page'}
                ]
            }]);
        });

        it('should remove only elem if it has same name as block', () => {
            var dep = {
                mustDeps: [
                    {block: 'page'},
                    {elem: 'page'}
                ]
            };

            expect(removeEntity({elem: 'page'}, dep)).to.eql([{
                mustDeps: [
                    {block: 'page'}
                ]
            }]);
        });
    });
    
    describe('elem as array', () => {
        it('should remove one elem', () => {
            var dep = {
                mustDeps: [
                    {elem: ['page', 'i-ua']}
                ]
            };

            expect(removeEntity({elem: 'page'}, dep)).to.eql([{
                mustDeps: [
                    {elem: ['i-ua']}
                ]
            }]);
        });

        it('should not remove elem that does not match', () => {
            var dep = {
                mustDeps: [
                    {elem: ['page', 'i-ua']}
                ]
            };

            expect(removeEntity({elem: 'doggy'}, dep)).to.eql([{
                mustDeps: [
                    {elem: ['page', 'i-ua']}
                ]
            }]);
        });

        describe('withBlock', () => {
            it('should remove elem and block', () => {
                var dep = {
                    mustDeps: [
                        {block: 'html', elem: ['page']},
                        {elem: 'i-ua'}
                    ]
                };

                expect(removeEntity({block: 'html', elem: 'page'}, dep)).to.eql([{
                    mustDeps: [
                        {elem: 'i-ua'}
                    ]
                }]);
            });

            it('should not remove elem from block if entity has no block field', () => {
                var dep = {
                    mustDeps: [
                        {block: 'html', elem: ['page']},
                        {elem: 'page'}
                    ]
                };

                expect(removeEntity({elem: 'page'}, dep)).to.eql([{
                    mustDeps: [
                        {block: 'html', elem: ['page']}
                    ]
                }]);
            });

            it('should remove several declaration of same dep', () => {
                var dep = {
                    mustDeps: [
                        {block: 'html', elem: ['page']},
                        {block: 'html', elem: ['page']},
                        {elem: 'i-ua'}
                    ]
                };

                expect(removeEntity({block: 'html', elem: 'page'}, dep)).to.eql([{
                    mustDeps: [
                        {elem: 'i-ua'}
                    ]
                }]);
            });

            it('should remove elemString & elem', () => {
                var dep = {
                    mustDeps: [
                        {block: 'html', elem: 'page'},
                        {block: 'html', elem: ['page']},
                        {elem: 'i-ua'}
                    ]
                };

                expect(removeEntity({block: 'html', elem: 'page'}, dep)).to.eql([{
                    mustDeps: [
                        {elem: 'i-ua'}
                    ]
                }]);
            });
        });
    });
});

describe('elems', () => {
    describe('elemsString', () => {
        describe('withBlock', () => {
            it('should remove elem but leave the block', () => {
                var dep = {
                    mustDeps: [
                        {block: 'html', elems: 'page'},
                        {elems: 'i-ua'}
                    ]
                };

                expect(removeEntity({block: 'html', elem: 'page'}, dep)).to.eql([{
                    mustDeps: [
                        {block: 'html'},
                        {elems: 'i-ua'}
                    ]
                }]);
            });

            it('should not remove elem from block if entity has no block field', () => {
                var dep = {
                    mustDeps: [
                        {block: 'html', elems: 'page'},
                        {elems: 'page'}
                    ]
                };

                expect(removeEntity({elem: 'page'}, dep)).to.eql([{
                    mustDeps: [
                        {block: 'html', elems: 'page'}
                    ]
                }]);
            });
        });

        it('should remove one elem', () => {
            var dep = {
                mustDeps: [
                    {elems: 'page'},
                    {elems: 'i-ua'}
                ]
            };

            expect(removeEntity({elem: 'page'}, dep)).to.eql([{
                mustDeps: [
                    {elems: 'i-ua'}
                ]
            }]);
        });

        it('should not remove elem that does not match', () => {
            var dep = {
                mustDeps: [
                    {elems: 'page'},
                    {elems: 'i-ua'}
                ]
            };

            expect(removeEntity({elem: 'doggy'}, dep)).to.eql([{
                mustDeps: [
                    {elems: 'page'},
                    {elems: 'i-ua'}
                ]
            }]);
        });

        it('should not remove elem if it has same name as block', () => {
            var dep = {
                mustDeps: [
                    {elems: 'page'},
                    {elems: 'i-ua'}
                ]
            };

            expect(removeEntity({block: 'page'}, dep)).to.eql([{
                mustDeps: [
                    {elems: 'page'},
                    {elems: 'i-ua'}
                ]
            }]);
        });

        it('should remove only block if it has same name as elem', () => {
            var dep = {
                mustDeps: [
                    {block: 'page'},
                    {elems: 'page'}
                ]
            };

            expect(removeEntity({block: 'page'}, dep)).to.eql([{
                mustDeps: [
                    {elems: 'page'}
                ]
            }]);
        });

        it('should remove only elem if it has same name as block', () => {
            var dep = {
                mustDeps: [
                    {block: 'page'},
                    {elems: 'page'}
                ]
            };

            expect(removeEntity({elem: 'page'}, dep)).to.eql([{
                mustDeps: [
                    {block: 'page'}
                ]
            }]);
        });
    });
    
    describe('elem as array', () => {
        it('should remove one elem', () => {
            var dep = {
                mustDeps: [
                    {elems: ['page', 'i-ua']}
                ]
            };

            expect(removeEntity({elem: 'page'}, dep)).to.eql([{
                mustDeps: [
                    {elems: ['i-ua']}
                ]
            }]);
        });

        it('should not remove elem that does not match', () => {
            var dep = {
                mustDeps: [
                    {elems: ['page', 'i-ua']}
                ]
            };

            expect(removeEntity({elem: 'doggy'}, dep)).to.eql([{
                mustDeps: [
                    {elems: ['page', 'i-ua']}
                ]
            }]);
        });

        describe('withBlock', () => {
            it('should remove elem but leave the block', () => {
                var dep = {
                    mustDeps: [
                        {block: 'html', elems: ['page']},
                        {elems: 'i-ua'}
                    ]
                };

                expect(removeEntity({block: 'html', elem: 'page'}, dep)).to.eql([{
                    mustDeps: [
                        {block: 'html'},
                        {elems: 'i-ua'}
                    ]
                }]);
            });

            it('should not remove elem from block if entity has no block field', () => {
                var dep = {
                    mustDeps: [
                        {block: 'html', elems: ['page']},
                        {elems: 'page'}
                    ]
                };

                expect(removeEntity({elem: 'page'}, dep)).to.eql([{
                    mustDeps: [
                        {block: 'html', elems: ['page']}
                    ]
                }]);
            });

            it('should remove several declaration of same dep', () => {
                var dep = {
                    mustDeps: [
                        {block: 'html', elems: ['page']},
                        {block: 'html', elems: ['page']},
                        {elems: 'i-ua'}
                    ]
                };

                expect(removeEntity({block: 'html', elem: 'page'}, dep)).to.eql([{
                    mustDeps: [
                        {block: 'html'},
                        {block: 'html'},
                        {elems: 'i-ua'}
                    ]
                }]);
            });

            it('should remove elemString & elem', () => {
                var dep = {
                    mustDeps: [
                        {block: 'html', elems: 'page'},
                        {block: 'html', elems: ['page']},
                        {elems: 'i-ua'}
                    ]
                };

                expect(removeEntity({block: 'html', elem: 'page'}, dep)).to.eql([{
                    mustDeps: [
                        {block: 'html'},
                        {block: 'html'},
                        {elems: 'i-ua'}
                    ]
                }]);
            });
        });
    });
});

describe('mods', () => {
    describe('block_mod', () => {
        it('should delete whole dep', () => {
            var dep = {
                mustDeps: [
                    {block: 'popup', modName: 'visible'},
                ]
            };

            expect(removeEntity({block: 'popup'}, dep)).to.eql([]);
        });
    });

    describe('block__elem_mod', () => {
        it('should delete whole dep', () => {
            var dep = {
                mustDeps: [
                    {block: 'popup', elem: 'tail', modName: 'visible'},
                ]
            };

            expect(removeEntity({block: 'popup'}, dep)).to.eql([]);
        });
    });
});
